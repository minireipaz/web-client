package controllers

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WorkflowController struct {
	service     *services.WorkflowService
	authService *services.AuthService
}

func NewWorkflowController(service *services.WorkflowService, authServ *services.AuthService) *WorkflowController {
	return &WorkflowController{
		service:     service,
		authService: authServ,
	}
}

func (wc *WorkflowController) CreateWorkflow(ctx *gin.Context) {
	newWorkflow := ctx.MustGet("workflow").(models.Workflow)
	serviceUserToken, err := wc.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	createdWorkflow := wc.service.CreateWorkflow(newWorkflow, serviceUserToken)

	ctx.JSON(http.StatusOK, createdWorkflow)
}
