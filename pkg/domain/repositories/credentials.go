package repositories

import "minireipaz/pkg/domain/models"

type CredentialsRepository interface {
	GenerateGoogleOAuthURL(credential *models.RequestCreateCredential, serviceUserAccessToken *string) models.ResponseCreateCredential
	ExchangeGogleOAuth(code *string, serviceUserAccessToken *string) *models.ResponseCreateCredential
}
