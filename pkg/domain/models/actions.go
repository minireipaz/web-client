package models

const (
	Googlesheets = "googlesheets"
	NotAccept    = "Type not acceptable"
)

type RequestGoogleAction struct {
	Pollmode       string `json:"pollmode"`
	Selectdocument string `json:"selectdocument"`
	Document       string `json:"document"`
	Selectsheet    string `json:"selectsheet"`
	Sheet          string `json:"sheet"`
	Operation      string `json:"operation"`
	Credentialid   string `json:"credentialid"`
	Sub            string `json:"sub"`
	Type           string `json:"type"`
	Workflowid     string `json:"workflowid"`
	Nodeid         string `json:"nodeid"`
	Redirecturl    string `json:"redirecturl"`
}

type ResponseGetGoogleSheetByID struct {
	Status int    `json:"status"`
	Error  string `json:"error"`
	Data   string `json:"data"`
}
