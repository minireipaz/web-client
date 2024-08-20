package middlewares

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.ContentType() != "application/json" {
			c.JSON(http.StatusUnsupportedMediaType, NewUnsupportedMediaTypeError("Only application/json is supported"))
			c.Abort()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			c.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			c.Abort()
			return
		}

		valid := verifyUserToken(authService, token)
		if !valid {
			c.JSON(http.StatusUnauthorized, NewUnauthorizedError(models.AuthInvalid))
			c.Abort()
			return
		}

		c.Next()
	}
}

func verifyUserToken(authService *services.AuthService, userToken string) bool {
	isValid := authService.VerifyUserToken(userToken)
	return isValid
}
