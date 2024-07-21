package httpclient

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"minireipaz/pkg/config"
	"minireipaz/pkg/domain/models"
	"net/url"
)

type WorkflowRepository struct {
	client HTTPClient
}

func NewWorkflowRepository(client HTTPClient) *WorkflowRepository {
	return &WorkflowRepository{client: client}
}

func (r *WorkflowRepository) CreateWorkflow(workflow models.Workflow, accesToken string) models.ResponseWorkflow {
	jsonData, err := json.Marshal(workflow)
	if err != nil {
		log.Printf("Error marshalling workflow: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}

	baseURI := fmt.Sprintf("%s/api/workflows", config.GetEnv("URI_BACKEND", "http://localhost:4020"))
	uriBackend, err := validateURL(baseURI)
	if err != nil {
		log.Printf("Error validateURL workflow: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}

	req, err := http.NewRequest("POST", uriBackend, NewBuffer(jsonData))
	if err != nil {
		log.Printf("Error creating request: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accesToken))

	resp, err := r.client.Do(req)
	if err != nil {
		log.Printf("Error response from backend: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}

	var createdWorkflow models.ResponseWorkflow
	err = json.Unmarshal(body, &createdWorkflow)
	if err != nil {
		log.Printf("Error unmarshalling workflow: %v", err)
		return models.ResponseWorkflow{
			Status: http.StatusInternalServerError,
		}
	}
	return createdWorkflow
}

func validateURL(rawURL string) (string, error) {
	parsedURL, err := url.ParseRequestURI(rawURL)
	if err != nil {
		return "", errors.New("invalid URL")
	}

	return parsedURL.String(), nil
}
