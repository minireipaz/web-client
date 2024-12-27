package httpclient

import (
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
)

type UserRepository struct {
	client HTTPClient
}

func NewUserRepository(client HTTPClient) *UserRepository {
	return &UserRepository{client: client}
}

func (ur *UserRepository) CheckExistUser(user *models.Users, serviceUserAccessToken *string) models.ResponseExistUser {
	url, err := getBackendURL("/api/v1/users")
	if err != nil {
		return models.ResponseExistUser{
			Exist:   false,
			Created: false,
			Error:   err.Error(),
		}
	}

	body, err := ur.client.DoRequest("POST", url, *serviceUserAccessToken, user)
	if err != nil {
		return models.ResponseExistUser{
			Exist:   false,
			Created: false,
			Error:   err.Error(),
		}
	}

	var userResponse models.ResponseExistUser
	if err := json.Unmarshal(body, &userResponse); err != nil {
		log.Printf("ERROR | error unmarshalling response: %v", err)
		return models.ResponseExistUser{
			Exist:   false,
			Created: false,
			Error:   fmt.Sprintf("error unmarshalling response: %v", err),
		}
	}

	return userResponse
}
