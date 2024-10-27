package repositories

import "minireipaz/pkg/domain/models"

type WorkflowRepository interface {
	CreateWorkflow(workflow models.Workflow, serviceUserAccessToken string) models.ResponseWorkflow
	GetWorkflow(userID, workflowID, userToken, serviceUserAccessToken *string) models.ResponseWorkflow
	GetAllWorkflow(userID, userToken, serviceUserAccessToken *string) models.ResponseAllWorkflow
	UpdateWorkflow(workflow models.Workflow, serviceUserAccessToken string) models.ResponseUpdatedWorkflow
}
