package httpclient

import (
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
	"net/http"
)

type WorkflowRepository struct {
	client HTTPClient
}

func NewWorkflowRepository(client HTTPClient) *WorkflowRepository {
	return &WorkflowRepository{client: client}
}

func (r *WorkflowRepository) CreateWorkflow(workflow models.Workflow, serviceUserAccessToken string) models.ResponseWorkflow {
	url, err := getBackendURL("/api/workflows")
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	body, err := r.client.DoRequest("POST", url, serviceUserAccessToken, workflow)
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	var createdWorkflow models.ResponseWorkflow
	if err := json.Unmarshal(body, &createdWorkflow); err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	return createdWorkflow
}

func (r *WorkflowRepository) GetWorkflow(userID, workflowID, userToken, serviceUserAccessToken *string) models.ResponseWorkflow {
	url, err := getBackendURL(fmt.Sprintf("/api/workflows/%s/%s", *userID, *workflowID))
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    fmt.Sprintf("ERROR | %v", err),
			Workflow: models.Workflow{},
		}
	}

	body, err := r.client.DoRequest("GET", url, *serviceUserAccessToken, nil)
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    fmt.Sprintf("ERROR | %v", err),
			Workflow: models.Workflow{},
		}
	}

	var newResponse models.ResponseWorkflow
	if err := json.Unmarshal(body, &newResponse); err != nil {
		return models.ResponseWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    "Not valid URL",
			Workflow: models.Workflow{},
		}
	}

	return newResponse
}

func (r *WorkflowRepository) GetAllWorkflow(userID, userToken, serviceUserAccessToken *string) models.ResponseAllWorkflow {
	url, err := getBackendURL(fmt.Sprintf("/api/workflows/%s", *userID))
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseAllWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    fmt.Sprintf("ERROR | %v", err),
			Workflow: nil,
		}
	}

	body, err := r.client.DoRequest("GET", url, *serviceUserAccessToken, nil)
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseAllWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    fmt.Sprintf("ERROR | %v", err),
			Workflow: nil,
		}
	}

	var newResponse models.ResponseAllWorkflow
	if err := json.Unmarshal(body, &newResponse); err != nil {
		return models.ResponseAllWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    "Not valid URL",
			Workflow: nil,
		}
	}

	return newResponse
}

func (r *WorkflowRepository) UpdateWorkflow(workflow models.Workflow, serviceUserAccessToken string) models.ResponseUpdatedWorkflow {
	url, err := getBackendURL(fmt.Sprintf("/api/workflows/%s", workflow.UUID))
	if err != nil {
		return models.ResponseUpdatedWorkflow{Status: http.StatusInternalServerError}
	}

	body, err := r.client.DoRequest("PUT", url, serviceUserAccessToken, workflow)
	if err != nil {
		return models.ResponseUpdatedWorkflow{Status: http.StatusInternalServerError}
	}

	var updatedWorkflow models.ResponseUpdatedWorkflow
	if err := json.Unmarshal(body, &updatedWorkflow); err != nil {
		return models.ResponseUpdatedWorkflow{Status: http.StatusInternalServerError}
	}

	return updatedWorkflow
}
