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

type Status uint8

const (
	Initial    Status = iota + 1 // Initial = 1
	Pending                      // Pending = 2
	Completed                    // Completed = 3
	Processing                   // Processing = 4
	Failed                       // Failed = 5
)

type Workflow struct {
	WorkflowInit      time.Time `json:"workflow_init,omitempty"`
	WorkflowCompleted time.Time `json:"workflow_completed,omitempty"`
	Duration          *int64    `json:"duration,omitempty"`
	Status            *Status   `json:"status,omitempty"`
	Viewport          *Viewport `json:"viewport,omitempty"`
	UserToken         string    `json:"access_token,omitempty"`
	CreatedAt         string    `json:"created_at,omitempty"`
	UpdatedAt         string    `json:"updated_at,omitempty"`
	Name              string    `json:"name" binding:"required,max=255"`
	Description       string    `json:"description,omitempty"`
	DirectoryToSave   string    `json:"directory_to_save" binding:"required,max=255"`
	UUID              string    `json:"id,omitempty"`
	UserID            string    `json:"user_id,omitempty"`
	Nodes             []Node    `json:"nodes,omitempty"`
	Edges             []Edge    `json:"edges,omitempty"`
	IsActive          IsActive  `json:"is_active,omitempty"`
}

type ResponseWorkflow struct {
	Error       string                       `json:"error"`
	Credentials []ResponseExchangeCredential `json:"credentials"`
	Workflow    Workflow                     `json:"workflow"`
	Status      int                          `json:"status"`
}

type ResponseAllWorkflow struct {
	Error       string       `json:"error"`
	Workflow    []Workflow   `json:"workflow"`
	Credentials []Credential `json:"credentials"`
	Status      int          `json:"status"`
}

type ResponseUpdatedWorkflow struct {
	Error  string `json:"error"`
	Status int    `json:"status"`
}

type WorkflowDetail struct {
	WorkflowDescription *string    `json:"workflow_description,omitempty"`
	WorkflowStatus      *int       `json:"workflow_status,omitempty"`
	ExecutionStatus     *int       `json:"execution_status,omitempty"`
	StartTime           *time.Time `json:"start_time,omitempty"`
	Duration            *int       `json:"duration,omitempty"`
	WorkflowID          string     `json:"workflow_id"`
	WorkflowName        string     `json:"workflow_name"`
}

type WorkflowsCount struct {
	TotalWorkflows      *int64 `json:"total_workflows,omitempty"`
	SuccessfulWorkflows *int64 `json:"successful_workflows,omitempty"`
	FailedWorkflows     *int64 `json:"failed_workflows,omitempty"`
	PendingWorkflows    *int64 `json:"pending_workflows,omitempty"`
}

type RecentWorkflow struct {
	WorkflowDescription *string    `json:"workflow_description,omitempty"`
	ExecutionStatus     *int       `json:"execution_status,omitempty"`
	StartTime           *time.Time `json:"start_time,omitempty"`
	Duration            *int       `json:"duration,omitempty"`
	WorkflowName        string     `json:"workflow_name"`
}

type RequestUpdateWorkflow struct {
	UserID           string   `json:"user_id"`
	AccessToken      string   `json:"access_token"`
	WorkflowFrontend Workflow `json:"data"`
}

type RequestInfoWorkflow struct {
	UserID      string `json:"user_id"`
	AccessToken string `json:"access_token"`
}

//

type Edge struct {
	ID       *string `json:"id,omitempty"`
	Source   *string `json:"source,omitempty"`
	Target   *string `json:"target,omitempty"`
	Type     *string `json:"type,omitempty"`
	Animated *bool   `json:"animated,omitempty"`
	Style    *Style  `json:"style,omitempty"`
}

type Style struct {
	Stroke *string `json:"stroke,omitempty"`
}

type Node struct {
	ID       *string   `json:"id,omitempty"`
	Type     *string   `json:"type,omitempty"`
	Position *Position `json:"position,omitempty"`
	Data     *DataNode `json:"data,omitempty"`
	Measured *Measured `json:"measured,omitempty"`
}

type DataNode struct {
	ID             *string                 `json:"id,omitempty"`
	Label          *string                 `json:"label,omitempty"`
	Options        *string                 `json:"options,omitempty"`
	Description    *string                 `json:"description,omitempty"`
	WorkflowID     *string                 `json:"workflowid,omitempty"`
	NodeID         *string                 `json:"nodeid,omitempty"`
	Type           *string                 `json:"type,omitempty"`
	ContentData    FormData                `json:"formdata"`
	CredentialData RequestCreateCredential `json:"credential"`
}

type Measured struct {
	Width  *float64 `json:"width,omitempty"`
	Height *float64 `json:"height,omitempty"`
}

type Position struct {
	X *float64 `json:"x,omitempty"`
	Y *float64 `json:"y,omitempty"`
}

type Viewport struct {
	X    *float64 `json:"x,omitempty"`
	Y    *float64 `json:"y,omitempty"`
	Zoom *float64 `json:"zoom,omitempty"`
}

type FormData struct {
	Pollmode       string `json:"pollmode"`
	Selectdocument string `json:"selectdocument"`
	Document       string `json:"document"`
	Selectsheet    string `json:"selectsheet"`
	Sheet          string `json:"sheet"`
	Operation      string `json:"operation"`
}
