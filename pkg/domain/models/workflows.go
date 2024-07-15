package models

import (
	"time"

	"github.com/google/uuid"
)

type Workflow struct {
	Sub             string    `json:"sub"`
	UUID            uuid.UUID `json:"uuid"`
	WorkflowName    string    `json:"workflowname"`
	DirectoryToSave string    `json:"directorytosave"`
	CreatedAt       time.Time `json:"createdat"`
	UpdatedAt       time.Time `json:"updatedat"`
}
