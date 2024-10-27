package services

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
)

type WorkflowService struct {
	workflowRepo repositories.WorkflowRepository
}

func NewWorkflowService(repo repositories.WorkflowRepository) *WorkflowService {
	return &WorkflowService{workflowRepo: repo}
}

func (s *WorkflowService) CreateWorkflow(workflow models.Workflow, serviceUserToken *string) models.ResponseWorkflow {
	return s.workflowRepo.CreateWorkflow(workflow, *serviceUserToken)
}

func (s *WorkflowService) GetWorkflow(userID, workflowID, userToken, serviceUserAccessToken *string) models.ResponseWorkflow {
	return s.workflowRepo.GetWorkflow(userID, workflowID, userToken, serviceUserAccessToken)
}

func (s *WorkflowService) GetAllWorkflow(userID, userToken, serviceUserAccessToken *string) models.ResponseAllWorkflow {
	return s.workflowRepo.GetAllWorkflow(userID, userToken, serviceUserAccessToken)
}

func (s *WorkflowService) UpdateWorkflow(workflow models.Workflow, serviceUserToken *string) models.ResponseUpdatedWorkflow {
	return s.workflowRepo.UpdateWorkflow(workflow, *serviceUserToken)
}
