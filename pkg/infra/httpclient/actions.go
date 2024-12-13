package httpclient

import (
	"encoding/json"
	"minireipaz/pkg/domain/models"
)

type ActionsRepository struct {
	client HTTPClient
}

func NewActionsRepository(client HTTPClient) *ActionsRepository {
	return &ActionsRepository{client: client}
}

func (a *ActionsRepository) GetGoogleSheetByID(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	url, err := getBackendURL("/api/actions/google/sheets")
	if err != nil {
		return nil
	}

	body, err := a.client.DoRequest("POST", url, *serviceUser, newAction)
	if err != nil {
		return nil
	}

	var response *models.ResponseGetGoogleSheetByID
	if err := json.Unmarshal(body, &response); err != nil {
		return nil
	}

	return response
}
