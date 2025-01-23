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

func (a *ActionsController) CreateActionsGoogleSheet(ctx *gin.Context) {
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
		Error:  models.TypeNotAceptable,
		Status: http.StatusInternalServerError,
	}
	switch newAction.Type {
	case models.Googlesheets:
		response = *a.service.CreateActionsGoogleSheet(newAction, serviceUserToken)
	default:
		log.Printf("ERROR | type not acceptable %v", newAction)
	}
	ctx.JSON(response.Status, response)
}

func (a *ActionsController) CreateNotionAction(ctx *gin.Context) {
	newAction := ctx.MustGet(models.ActionNotionKey).(models.RequestGoogleAction)
	serviceUserToken, err := a.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	response := models.ResponseGetGoogleSheetByID{
		Error:  models.TypeNotAceptable,
		Status: http.StatusInternalServerError,
	}
	switch newAction.Type {
	case models.NotionToken:
		response = *a.service.CreateActionsNotion(newAction, serviceUserToken)
	case models.NotionOAuth:
		response = *a.service.CreateActionsNotion(newAction, serviceUserToken)
	default:
		log.Printf("ERROR | type not acceptable %v", newAction)
	}
	ctx.JSON(response.Status, response)
}

// not used retries
func (a *ActionsController) PollingGetGoogleSheetByID(ctx *gin.Context) {
	actionID := ctx.Param("idaction")
	userID := ctx.Param("iduser")
	serviceUserToken, err := a.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	response := models.ResponseGetGoogleSheetByID{
		Error:  "",
		Status: http.StatusOK,
	}
	// coupled response
	data := a.service.GetGoogleSheetByID(&actionID, &userID, serviceUserToken)
	if data == nil {
		response = models.ResponseGetGoogleSheetByID{
			Error:  models.TypeNotAceptable,
			Status: http.StatusInternalServerError,
		}
		ctx.JSON(http.StatusInternalServerError, response)
		return
	}
	response.Data = *data
	ctx.JSON(response.Status, response)
}

func (a *ActionsController) PollingGetNotionByID(ctx *gin.Context) {
	actionID := ctx.Param("idaction")
	userID := ctx.Param("iduser")
	// typeNotion := ctx.Param("type")
	serviceUserToken, err := a.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	response := models.ResponseGetGoogleSheetByID{
		Error:  "",
		Status: http.StatusOK,
	}
	// coupled response
	data := a.service.GetNotionActionByID(&actionID, &userID, serviceUserToken)
	if data == nil {
		response = models.ResponseGetGoogleSheetByID{
			Error:  models.TypeNotAceptable,
			Status: http.StatusInternalServerError,
		}
		ctx.JSON(http.StatusInternalServerError, response)
		return
	}
	response.Data = *data
	ctx.JSON(response.Status, response)
}
