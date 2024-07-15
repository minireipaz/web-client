package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"minireipaz/pkg/config"
	"minireipaz/pkg/domain/models"
	"net/http"
	"net/url"
)

func CreateWorkflow(workflow models.Workflow) models.Workflow {
	jsonData, err := json.Marshal(workflow)
	if err != nil {
		log.Printf("Error marshalling workflow: %v", err)
		return models.Workflow{}
	}
	baseURI := fmt.Sprintf("%s/api/workflows", config.GetEnv("URI_BACKEND", "http://localhost:4020"))
	uriBackend, err := validateURL(baseURI)
	if err != nil {
		log.Printf("Error creating workflow: %v", err)
		return models.Workflow{}
	}
	resp, err := http.Post(uriBackend, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Error creating workflow: %v", err)
		return models.Workflow{}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response: %v", err)
		return models.Workflow{}
	}

	var createdWorkflow models.Workflow
	err = json.Unmarshal(body, &createdWorkflow)
	if err != nil {
		log.Printf("Error creating workflow: %v", err)
		return models.Workflow{}
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
