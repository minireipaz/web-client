package models

import "time"

const (
	LayoutTimestamp       = time.RFC3339 // format "2006-01-02T15:04:05Z07:00"
	MaxAttempts           = 11
	MinRangeSleepDuration = 100 * time.Millisecond // min range time wait offset
	MaxRangeSleepDuration = 500 * time.Millisecond // max range time wait offset
	SleepOffset           = 50 * time.Millisecond  // offset
	SaveOffset            = 10
	TwoDays               = 172_800 * time.Second
	TimeoutRequest        = 5 * time.Minute
	TimeoutIDLEConnection = 0 * time.Second
)

var ValidCredentialTypes = map[string]bool{
	"googlesheets": true,
}

const (
  CredentialCreateContextKey = "createcredential"
  RequestUpdateWorkflowContextKey = "requestupdate"
  ValidateUserContextKey = "user"
  ValidateWorkflowContextKey = "workflow"
)

var PermitedPathList = map[string]bool{
  "/oauth2-credential/callback": true,
}
