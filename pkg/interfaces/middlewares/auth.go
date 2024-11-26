package middlewares

import (
	"log"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		log.Printf("fullpath=%s", ctx.FullPath())
		if models.PermitedPathList[ctx.FullPath()] {
			ctx.Next()
			return
		}

		if ctx.ContentType() != "application/json" {
			ctx.JSON(http.StatusUnsupportedMediaType, NewUnsupportedMediaTypeError("Only application/json is supported"))
			ctx.Abort()
			return
		}

		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			ctx.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			log.Printf("%s", token)
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			ctx.Abort()
			return
		}
		// TODO:
		valid, expired := verifyUserToken(authService, token) // when pass 12 hours, get invalidaded
		if !valid {
			log.Printf("WARN | usertoken is not valid. token to verify %s", token)
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			ctx.Abort()
			return
		}
		if expired {
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.UserTokenExpired))
			ctx.Abort()
			return
		}
		ctx.Set("usertoken", token)
		ctx.Next()
	}
}

func verifyUserToken(authService *services.AuthService, userToken string) (bool, bool) {
	isValid, expired := authService.VerifyUserToken(userToken)
  log.Printf("isValid %v", isValid)
	return isValid, expired
}
