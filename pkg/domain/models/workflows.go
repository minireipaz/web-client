package models

import (
	"time"

	"github.com/google/uuid"
)

type Workflow struct {
	Sub             string    `json:"sub"`
	UserToken       string    `json:"access_token"`
	UUID            uuid.UUID `json:"uuid"`
	WorkflowName    string    `json:"workflowname"`
	DirectoryToSave string    `json:"directorytosave"`
	CreatedAt       time.Time `json:"createdat"`
	UpdatedAt       time.Time `json:"updatedat"`
}

type ResponseWorkflow struct {
	Error    string   `json:"error"`
	Workflow Workflow `json:"workflow"`
	Status   int      `json:"status"`
}
