package models

const (
	UserNameExist          = "username already exists"
	UserCannotGenerate     = "error checking Sub existence"
	UserNameCannotCreate   = "error checking username existence"
	UsertNameNotGenerate   = "cannot create new user"
	UserSubExist           = "Sub already exists"
	UserSubIsRequired      = "Sub is required"
	UserTokenExpired       = "token expired"
	UserSubInvalid         = "Sub must be a numeric string with max length of 50"
	UserAccessTokenInvalid = "Access token must be a valid JWT with max length of 1000"
	UserSubRequired        = "Sub user is required"
	UserSubMustBe          = "Sub user must greater than 3 characters"
	UserInvalidStatus      = "Invalid status"
	UserInvalidRole        = "Invalid role ID"
	AuthInvalid            = "Authorization header is required"
)

type Users struct {
	IDToken     string  `json:"id_token,omitempty"`
	AccessToken string  `json:"access_token,omitempty"`
	TokenType   string  `json:"token_type,omitempty"`
	Scope       string  `json:"scope,omitempty"`
	Profile     Profile `json:"profile,omitempty"`
	ExpiresAt   int64   `json:"expires_at,omitempty"`
	UserID      string  `json:"user_id,omitempty"`
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
	Expired bool   `json:"expired"`
}

type UnauthorizedError struct {
	Error string `json:"error"`
}

type InvalidRequestError struct {
	Error string `json:"error"`
}

type UnsupportedMediaTypeError struct {
	Error string `json:"error"`
}

type TooManyRequestsError struct {
	Error string `json:"error"`
}

type ResponseVerifyTokenUser struct {
	Valid   bool   `json:"valid"`
	Expired bool   `json:"expired"`
	Error   string `json:"error"`
}
