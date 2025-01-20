package httpclient

import (
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
	"net/http"
)

type CredentialsRepository struct {
	client HTTPClient
}

func NewCredentialsRepository(client HTTPClient) *CredentialsRepository {
	return &CredentialsRepository{client: client}
}

func (c *CredentialsRepository) GenerateGoogleOAuthURL(credential *models.RequestCreateCredential, serviceUserAccessToken *string) models.ResponseCreateCredential {
	url, err := getBackendURL("/api/v1/google/credential")
	if err != nil {
		return models.ResponseCreateCredential{Status: http.StatusInternalServerError}
	}

	body, err := c.client.DoRequest("POST", url, *serviceUserAccessToken, credential)
	if err != nil {
		return models.ResponseCreateCredential{Status: http.StatusInternalServerError}
	}

	var createdCredential models.ResponseCreateCredential
	if err := json.Unmarshal(body, &createdCredential); err != nil {
		return models.ResponseCreateCredential{Status: http.StatusInternalServerError}
	}

	return createdCredential
}

func (c *CredentialsRepository) ExchangeGogleOAuth(response *models.ResponseExchangeCredential, serviceUserAccessToken *string) *models.ResponseExchangeCredential {
	url, err := getBackendURL("/api/v1/google/exchange")
	if err != nil {
		return &models.ResponseExchangeCredential{Status: http.StatusInternalServerError}
	}

	body, err := c.client.DoRequest("POST", url, *serviceUserAccessToken, response)
	if err != nil {
		return &models.ResponseExchangeCredential{Status: http.StatusInternalServerError}
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return &models.ResponseExchangeCredential{Status: http.StatusInternalServerError}
	}

	return response
}

func (c *CredentialsRepository) GetAllCredentials(userID, userToken, serviceUserToken *string) (response *models.ResponseGetAllCredential, err error) {
	url, err := getBackendURL(fmt.Sprintf("/api/v1/credentials/%s/%s", *userID, *userToken))
	if err != nil {
		log.Printf("ERROR | %v", err)
		return &models.ResponseGetAllCredential{
			Status: http.StatusInternalServerError,
			Error:  err.Error(),
		}, err
	}

	body, err := c.client.DoRequest("GET", url, *serviceUserToken, nil)
	if err != nil {
		log.Printf("ERROR | %v", err)
		return &models.ResponseGetAllCredential{
			Status: http.StatusInternalServerError,
			Error:  err.Error(),
		}, err
	}

	var newResponse *models.ResponseGetAllCredential
	if err := json.Unmarshal(body, &newResponse); err != nil {
		return &models.ResponseGetAllCredential{
			Status: http.StatusInternalServerError,
			Error:  err.Error(),
		}, err
	}

	return newResponse, nil
}

func (c *CredentialsRepository) NewCredentialTokenNotion(credential *models.RequestCreateCredential, serviceUserAccessToken *string) *models.ResponseExchangeCredential {
	url, err := getBackendURL("/api/v1/tokens/credential")
	if err != nil {
		log.Printf("ERROR | newcredentialtokennotion cannot parse url for /api/v1/tokens/credential %v", err)
		return nil
	}

	body, err := c.client.DoRequest("POST", url, *serviceUserAccessToken, credential)
	if err != nil {
		log.Printf("ERROR | newcredentialtokennotion cannot connect to backend %v", err)
		return nil
	}

	var createdCredential models.ResponseExchangeCredential
	if err := json.Unmarshal(body, &createdCredential); err != nil {
		log.Printf("ERROR | newcredentialtokennotion cannot unmarshal to backend %v body: %s", err, string(body))
		return nil
	}
	return &createdCredential
}
