package services

import (
	"errors"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
	"net/http"
	"strings"
)

type CredentialsService struct {
	credentialsRepo repositories.CredentialsRepository
}

func NewCredentialsService(repo repositories.CredentialsRepository) *CredentialsService {
	return &CredentialsService{credentialsRepo: repo}
}

func (c *CredentialsService) CreateGoogleCredential(currentCredential *models.RequestCreateCredential, serviceUserAccessToken *string) (response models.ResponseCreateCredential) {
	if err := c.validateGoogleCredentials(currentCredential); err != nil {
		return models.ResponseCreateCredential{
			Error:  err.Error(),
			Status: http.StatusBadRequest,
		}
	}
	return c.credentialsRepo.GenerateGoogleOAuthURL(currentCredential, serviceUserAccessToken)
}

// dummy validations
func (c *CredentialsService) validateGoogleCredentials(cred *models.RequestCreateCredential) error {
	if !strings.HasPrefix(cred.Data.RedirectURL, "http") {
		return errors.New("redirect URL must use HTTPS/HTTP")
	}

	if len(cred.Data.ClientID) < 20 {
		return errors.New("invalid client ID format")
	}

	if len(cred.Data.ClientSecret) < 10 {
		return errors.New("invalid client secret format")
	}

	return nil
}

func (c *CredentialsService) ExchangeOAuth(credential *models.ResponseExchangeCredential, serviceUserAccessToken *string) (response *models.ResponseExchangeCredential) {
	isOk, badRequest := c.validateScopeCodeState(&credential.Data.Code, credential.Data.Scopes, &credential.Data.State)
	if !isOk {
		return badRequest
	}

	platform := c.validateGoogleScopes(credential.Data.Scopes)
	if platform == "" {
		return &models.ResponseExchangeCredential{
			Error:  "bad request",
			Status: http.StatusBadRequest,
		}
	}

	switch platform {
	case "google":
		response = c.credentialsRepo.ExchangeGogleOAuth(credential, serviceUserAccessToken)
	default:
		response = &models.ResponseExchangeCredential{
			Error:  "bad request",
			Status: http.StatusBadRequest,
		}
	}

	return response
}

func (*CredentialsService) validateScopeCodeState(code *string, scopes []string, encryptedState *string) (bool, *models.ResponseExchangeCredential) {
	if code == nil || len(scopes) == 0 || scopes == nil || encryptedState == nil {
		return false, &models.ResponseExchangeCredential{
			Error:  "bad request",
			Status: http.StatusBadRequest,
		}
	}
	return true, nil
}

func (c *CredentialsService) validateGoogleScopes(scopes []string) string {
	if scopes == nil {
		return ""
	}
	if len(scopes) == 0 {
		return ""
	}
	for i := 0; i < len(scopes); i++ {
		if models.ValidScopes[scopes[i]] == "" {
			return ""
		}
	}
	return models.ValidScopes[scopes[0]] // optimistic, in theory all are from same provider
}

func (c *CredentialsService) GetAllCredentials(userID, userToken, serviceUserToken *string) (response *models.ResponseGetAllCredential) {
	response, err := c.credentialsRepo.GetAllCredentials(userID, userToken, serviceUserToken)
	if err != nil {
		return &models.ResponseGetAllCredential{
			Error:  err.Error(),
			Status: http.StatusBadRequest,
		}
	}
	return response
}
