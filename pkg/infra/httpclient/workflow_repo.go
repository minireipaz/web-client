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
	url, err := getBackendURL("/api/v1/workflows")
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	body, err := r.client.DoRequest("POST", url, serviceUserAccessToken, workflow)
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}
	// TODO: coupled to this model
	var createdWorkflow models.ResponseWorkflow
	if err := json.Unmarshal(body, &createdWorkflow); err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	return createdWorkflow
}

func (r *WorkflowRepository) GetWorkflow(userID, workflowID, userToken, serviceUserAccessToken *string) models.ResponseWorkflow {
	url, err := getBackendURL(fmt.Sprintf("/api/v1/workflows/%s/workflow/%s/%s", *userID, *workflowID, *userToken))
	if err != nil {
		log.Printf("ERROR | Cannot fetch workflow for userid %s workflowid %s error: %v", *userID, *workflowID, err)
		return models.ResponseWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    err.Error(),
			Workflow: models.Workflow{},
		}
	}

	body, err := r.client.DoRequest("GET", url, *serviceUserAccessToken, nil)
	if err != nil {
		log.Printf("ERROR | Cannot fetch workflow for userid %s workflowid %s error %v", *userID, *workflowID, err)
		return models.ResponseWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    err.Error(),
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
	url, err := getBackendURL(fmt.Sprintf("/api/v1/workflows/%s/%s", *userID, *userToken))
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseAllWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    err.Error(),
			Workflow: nil,
		}
	}

	body, err := r.client.DoRequest("GET", url, *serviceUserAccessToken, nil)
	if err != nil {
		log.Printf("ERROR | %v", err)
		return models.ResponseAllWorkflow{
			Status:   http.StatusInternalServerError,
			Error:    err.Error(),
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
	url, err := getBackendURL(fmt.Sprintf("/api/v1/workflows/%s", workflow.UUID))
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
