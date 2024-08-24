package models

// ResponseInfoDashboard represents response containing workflow counts
// also a list of the most recent workflows
type ResponseInfoDashboard struct {
	WorkflowCounts  WorkflowCounts   `json:"workflow_counts"`
	RecentWorkflows []RecentWorkflow `json:"recent_workflows"`
	Error           string           `json:"error"`
}
