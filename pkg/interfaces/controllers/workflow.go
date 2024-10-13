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

	ctx.JSON(createdWorkflow.Status, createdWorkflow)
}

func (wc *WorkflowController) GetWorkflowByID(ctx *gin.Context) {
	userID := ctx.Param("iduser")
	workflowID := ctx.Param("idworkflow")
	userToken := ctx.MustGet("usertoken").(string) // it's validated
	serviceUserToken, err := wc.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	newWorkflow := wc.service.GetWorkflow(&userID, &workflowID, &userToken, serviceUserToken)

	ctx.JSON(newWorkflow.Status, newWorkflow)
}

func (wc *WorkflowController) UpdateWorkflow(ctx *gin.Context) {
	request := ctx.MustGet("requestupdate").(models.RequestUpdateWorkflow)
	serviceUserToken, err := wc.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	workflowUpdated := wc.service.UpdateWorkflow(request.WorkflowFrontend, serviceUserToken)

	ctx.JSON(workflowUpdated.Status, workflowUpdated)
}
