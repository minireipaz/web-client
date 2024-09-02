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
	Description     string    `json:"description"`
	DirectoryToSave string    `json:"directorytosave"`
	CreatedAt       time.Time `json:"createdat"`
	UpdatedAt       time.Time `json:"updatedat"`
}

type ResponseWorkflow struct {
	Error    string   `json:"error"`
	Workflow Workflow `json:"workflow"`
	Status   int      `json:"status"`
}

type WorkflowDetail struct {
	WorkflowID          string     `json:"workflow_id"`
	WorkflowName        string     `json:"workflow_name"`
	WorkflowDescription *string    `json:"workflow_description,omitempty"`
	WorkflowStatus      *int       `json:"workflow_status,omitempty"`
	ExecutionStatus     *int       `json:"execution_status,omitempty"`
	StartTime           *time.Time `json:"start_time,omitempty"`
	Duration            *int       `json:"duration,omitempty"`
}

type WorkflowsCount struct {
	TotalWorkflows      *int64 `json:"total_workflows,omitempty"`
	SuccessfulWorkflows *int64 `json:"successful_workflows,omitempty"`
	FailedWorkflows     *int64 `json:"failed_workflows,omitempty"`
	PendingWorkflows    *int64 `json:"pending_workflows,omitempty"`
	// WorkflowName        *string     `json:"workflow_name,omitempty"`
	// WorkflowDescription *string     `json:"workflow_description,omitempty"`
	// ExecutionStatus     *int64      `json:"execution_status,omitempty"`
	// StartTime           *time.Time  `json:"start_time,omitempty"`
	// Duration            interface{} `json:"duration,omitempty"`
}

type RecentWorkflow struct {
	WorkflowName        string     `json:"workflow_name"`
	WorkflowDescription *string    `json:"workflow_description,omitempty"`
	ExecutionStatus     *int       `json:"execution_status,omitempty"`
	StartTime           *time.Time `json:"start_time,omitempty"`
	Duration            *int       `json:"duration,omitempty"`
}
