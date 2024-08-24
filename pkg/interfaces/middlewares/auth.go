package middlewares

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
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
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			ctx.Abort()
			return
		}

		valid := verifyUserToken(authService, token)
		if !valid {
			ctx.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			ctx.Abort()
			return
		}
		ctx.Set("usertoken", token)
		ctx.Next()
	}
}

func verifyUserToken(authService *services.AuthService, userToken string) bool {
	isValid := authService.VerifyUserToken(userToken)
	return isValid
}
