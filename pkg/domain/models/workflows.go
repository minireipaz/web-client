package models

import (
	"time"
)

type IsActive uint8

const (
	Active IsActive = iota + 1 // Active = 1
	Draft                      // Draft = 2
	Paused                     // Paused = 3
)

type Workflow struct {
	Sub               string    `json:"sub,omitempty"`
	UserToken         string    `json:"access_token,omitempty"`
	Name              string    `json:"name" binding:"required,alphanum,max=255"`
	Description       string    `json:"description,omitempty"`
	IsActive          IsActive  `json:"is_active,omitempty"` // Enum8('active' = 1, 'draft' = 2, 'paused' = 3) DEFAULT 'active'
	UUID              string    `json:"id,omitempty"`
	CreatedAt         string    `json:"created_at,omitempty"`
	UpdatedAt         string    `json:"updated_at,omitempty"`
	WorkflowInit      time.Time `json:"workflow_init,omitempty"`
	WorkflowCompleted time.Time `json:"workflow_completed,omitempty"`
	DirectoryToSave   string    `json:"directory_to_save" binding:"required,alphanum,max=255"`
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
