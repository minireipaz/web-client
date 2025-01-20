package models

const (
	Googlesheets = "googlesheets"
  NotionOAuth = "notionoauth"
  NotionToken = "notiontoken"
	NotAccept    = "Type not acceptable"
)

type RequestGoogleAction struct {
	ActionID       string `json:"actionid"` // not setted in frontend
	Pollmode       string `json:"pollmode"`
	Selectdocument string `json:"selectdocument"`
	Document       string `json:"document"`
	Selectsheet    string `json:"selectsheet"`
	Sheet          string `json:"sheet"`
	Operation      string `json:"operation"`
	Credentialid   string `json:"credentialid"`
	Sub            string `json:"sub"`
	// Type           string `json:"type"`
  Type           string `json:"type" binding:"oneof=googlesheets notiontoken notionoauth"`
	Workflowid     string `json:"workflowid"`
	Nodeid         string `json:"nodeid"`
	Redirecturl    string `json:"redirecturl"`
	Testmode       bool   `json:"testmode"`
}

type ResponseGetGoogleSheetByID struct {
	Error  string `json:"error"`
	Data   string `json:"data"`
	Status int    `json:"status"`
}
