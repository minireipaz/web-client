package httpclient

import (
	"encoding/json"
	"minireipaz/pkg/domain/models"
	"net/http"
)

type WorkflowRepository struct {
	client HTTPClient
}

func NewWorkflowRepository(client HTTPClient) *WorkflowRepository {
	return &WorkflowRepository{client: client}
}

func (r *WorkflowRepository) CreateWorkflow(workflow models.Workflow, accessToken string) models.ResponseWorkflow {
	url, err := getBackendURL("/api/workflows")
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	body, err := r.client.DoRequest("POST", url, accessToken, workflow)
	if err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	var createdWorkflow models.ResponseWorkflow
	if err := json.Unmarshal(body, &createdWorkflow); err != nil {
		return models.ResponseWorkflow{Status: http.StatusInternalServerError}
	}

	return createdWorkflow
}
