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

func (wc *WorkflowController) CreateWorkflow(c *gin.Context) {
	newWorkflow := c.MustGet("workflow").(models.Workflow)
	accessToken, err := wc.authService.GetAccessToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	createdWorkflow := wc.service.CreateWorkflow(newWorkflow, accessToken)

	c.JSON(http.StatusOK, gin.H{
		"error":    createdWorkflow.Error,
		"workflow": createdWorkflow.Workflow,
		"status":   createdWorkflow.Status,
	})
}
