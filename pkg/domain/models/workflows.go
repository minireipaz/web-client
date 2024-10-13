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
	UserID            string    `json:"user_id,omitempty"`
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
	//
	Status   *Status   `json:"status,omitempty"`
	Duration *int64    `json:"duration,omitempty"`
	Nodes    []Node    `json:"nodes,omitempty"`
	Edges    []Edge    `json:"edges,omitempty"`
	Viewport *Viewport `json:"viewport,omitempty"`
}

type ResponseWorkflow struct {
	Error    string   `json:"error"`
	Workflow Workflow `json:"workflow"`
	Status   int      `json:"status"`
}

type ResponseUpdatedWorkflow struct {
	Error  string `json:"error"`
	Status int    `json:"status"`
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
}

type RecentWorkflow struct {
	WorkflowName        string     `json:"workflow_name"`
	WorkflowDescription *string    `json:"workflow_description,omitempty"`
	ExecutionStatus     *int       `json:"execution_status,omitempty"`
	StartTime           *time.Time `json:"start_time,omitempty"`
	Duration            *int       `json:"duration,omitempty"`
}

type RequestUpdateWorkflow struct {
	WorkflowFrontend Workflow `json:"data"`
	UserID           string   `json:"user_id"`
	AccessToken      string   `json:"access_token"`
}

type RequestInfoWorkflow struct {
	UserID           string   `json:"user_id"`
	AccessToken      string   `json:"access_token"`
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
	ID          *string `json:"id,omitempty"`
	Label       *string `json:"label,omitempty"`
	Options     *string `json:"options,omitempty"`
	Description *string `json:"description,omitempty"`
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
	X    *float64   `json:"x,omitempty"`
	Y    *float64 `json:"y,omitempty"`
	Zoom *float64   `json:"zoom,omitempty"`
}
