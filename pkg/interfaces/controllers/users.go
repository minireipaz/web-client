package controllers

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	service     *services.UserService
	authService *services.AuthService
}

func NewUserController(service *services.UserService, authServ *services.AuthService) *UserController {
	return &UserController{
		service:     service,
		authService: authServ,
	}
}

func (uc *UserController) SyncUser(ctx *gin.Context) {
	currentUser := ctx.MustGet("user").(models.Users)
	serviceUserAccessToken, err := uc.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	response := uc.service.ExistUser(&currentUser, serviceUserAccessToken)
	if response.Error != "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	if !response.Created && !response.Exist {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  models.UserNameCannotCreate,
			"status": http.StatusInternalServerError,
		})
		return
	}

	// response.Status = 200
	ctx.JSON(http.StatusOK, response)
}
