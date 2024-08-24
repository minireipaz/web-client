package services

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/httpclient"
)

type WorkflowService struct {
	workflowRepo *httpclient.WorkflowRepository
}

func NewWorkflowService(repo *httpclient.WorkflowRepository) *WorkflowService {
	return &WorkflowService{workflowRepo: repo}
}

func (s *WorkflowService) CreateWorkflow(workflow models.Workflow, serviceUserToken *string) models.ResponseWorkflow {
	return s.workflowRepo.CreateWorkflow(workflow, *serviceUserToken)
}
