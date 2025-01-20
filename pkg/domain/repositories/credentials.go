package repositories

import "minireipaz/pkg/domain/models"

type CredentialsRepository interface {
	GenerateGoogleOAuthURL(credential *models.RequestCreateCredential, serviceUserAccessToken *string) models.ResponseCreateCredential
	ExchangeGogleOAuth(credential *models.ResponseExchangeCredential, serviceUserAccessToken *string) *models.ResponseExchangeCredential
	GetAllCredentials(userID, userToken, serviceUserAccessToken *string) (*models.ResponseGetAllCredential, error)
	NewCredentialTokenNotion(credential *models.RequestCreateCredential, serviceUserAccessToken *string) *models.ResponseExchangeCredential
}
