package models

// ResponseInfoDashboard represents response containing workflow counts
// also a list of the most recent workflows
type ResponseInfoDashboard struct {
	Error  string          `json:"error"`
	Data   []InfoDashboard `json:"data"`
	Status int             `json:"status"`
}

type InfoDashboard struct {
	TotalWorkflows      *int64      `json:"total_workflows,omitempty"`
	SuccessfulWorkflows *int64      `json:"successful_workflows,omitempty"`
	FailedWorkflows     *int64      `json:"failed_workflows,omitempty"`
	PendingWorkflows    *int64      `json:"pending_workflows,omitempty"`
	RecentWorkflows     [][]*string `json:"recent_workflows,omitempty"`
}
