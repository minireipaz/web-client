package models

const (
	UserStubExist        = "Stub already exists"
	UserNameExist        = "username already exists"
	UserCannotGenerate   = "error checking Stub existence"
	UserNameCannotCreate = "error checking username existence"
	UsertNameNotGenerate = "cannot create new user"
)

type Users struct {
	IDToken     string  `json:"id_token,omitempty"`
	AccessToken string  `json:"access_token,omitempty"`
	TokenType   string  `json:"token_type,omitempty"`
	Scope       string  `json:"scope,omitempty"`
	Profile     Profile `json:"profile,omitempty"`
	ExpiresAt   int64   `json:"expires_at,omitempty"`
	Sub         string  `json:"sub,omitempty"`
}

type Profile struct {
	Iss               *string  `json:"iss,omitempty"`
	Aud               []string `json:"aud,omitempty"`
	Exp               *int64   `json:"exp,omitempty"`
	Iat               *int64   `json:"iat,omitempty"`
	ClientID          *string  `json:"client_id,omitempty"`
	Name              *string  `json:"name,omitempty"`
	GivenName         *string  `json:"given_name,omitempty"`
	FamilyName        *string  `json:"family_name,omitempty"`
	Locale            *string  `json:"locale,omitempty"`
	UpdatedAt         *int64   `json:"updated_at,omitempty"`
	PreferredUsername *string  `json:"preferred_username,omitempty"`
	Email             *string  `json:"email,omitempty"`
	EmailVerified     *bool    `json:"email_verified,omitempty"`
}

type ResponseCreateUser struct {
}

type ResponseExistUser struct {
	Exist   bool   `json:"exist"`
	Error   string `json:"error"`
	Created bool   `json:"created"`
	Status  int    `json:"status"`
}
