package controllers

import (
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ActionsController struct {
	service     *services.ActionsService
	authService *services.AuthService
}

func NewActionsController(actionsServ *services.ActionsService, authServ *services.AuthService) *ActionsController {
	return &ActionsController{
		service:     actionsServ,
		authService: authServ,
	}
}

func (a *ActionsController) GetGoogleSheetByID(ctx *gin.Context) {
	newAction := ctx.MustGet(models.ActionGoogleKey).(models.RequestGoogleAction)
	serviceUserToken, err := a.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	response := models.ResponseGetGoogleSheetByID{
		Error:  models.NotAccept,
		Status: http.StatusInternalServerError,
	}
	switch newAction.Type {
	case models.Googlesheets:
		response = *a.service.GetGoogleSheetByID(newAction, serviceUserToken)
	default:
		log.Printf("ERROR | type not acceptable %v", newAction)
	}
	ctx.JSON(response.Status, response)
}
