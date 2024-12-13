package models

type RequestCreateCredential struct {
	ID         string         `json:"id" binding:"required,max=255"`
	Sub        string         `json:"sub" binding:"required,max=255"`
	Name       string         `json:"name" binding:"required,max=255"`
	Type       string         `json:"type" binding:"required,max=255"`
	WorkflowID string         `json:"workflowid" binding:"required,max=255"`
	NodeID     string         `json:"nodeid" binding:"required,max=255"`
	Data       DataCredential `json:"data" binding:"required"`
}

type DataCredential struct {
	ID           string   `json:"id,omitempty"`
	ClientID     string   `json:"clientId" binding:"required,max=255"`
	ClientSecret string   `json:"clientSecret" binding:"required,max=255"`
	RedirectURL  string   `json:"redirectURL" binding:"required,max=255"`
	OAuthURL     string   `json:"oauthurl,omitempty"`
	Scopes       []string `json:"scopes,omitempty"`
	State        string   `json:"state,omitempty"`
	Code         string   `json:"code,omitempty"`
	CodeVerifier string   `json:"codeverifier,omitempty"`
	Token        string   `json:"token,omitempty"`
	TokenRefresh string   `json:"tokenrefresh,omitempty"`
}

type ResponseCreateCredential struct {
	Data            string  `json:"data,omitempty"`
	Status          int     `json:"status,omitempty"`
	Error           string  `json:"error,omitempty"`
	AuthRedirectURL *string `json:"auth_url,omitempty"`
}

type ResponseExchangeCredential struct {
	Error      string         `json:"error,omitempty"`
	Status     int            `json:"status,omitempty"`
	ID         string         `json:"id,omitempty"`
	Sub        string         `json:"sub,omitempty"`
	Name       string         `json:"name,omitempty"`
	Type       string         `json:"type,omitempty"`
	WorkflowID string         `json:"workflowid" binding:"required,max=255"`
	NodeID     string         `json:"nodeid" binding:"required,max=255"`
	Data       DataCredential `json:"data" binding:"required"`
}

type ResponseGetAllCredential struct {
	Credentials *[]ResponseExchangeCredential `json:"credentials"`
	Status      int                           `json:"status"`
	Error       string                        `json:"error"`
}

type Credential interface {
	GetName() string
	GetSub() string
	GetType() string
}

var ValidScopes = map[string]string{
	"https://www.googleapis.com/auth/spreadsheets.readonly": "google",
}

func (r *RequestCreateCredential) GetName() string {
	return r.Name
}

func (r *RequestCreateCredential) GetSub() string {
	return r.Sub
}

func (r *RequestCreateCredential) GetType() string {
	return r.Type
}

func (r *ResponseExchangeCredential) GetName() string {
	return r.Name
}

func (r *ResponseExchangeCredential) GetSub() string {
	return r.Sub
}

func (r *ResponseExchangeCredential) GetType() string {
	return r.Type
}
