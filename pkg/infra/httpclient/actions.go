package httpclient

import (
	"encoding/json"
	"fmt"
	"minireipaz/pkg/domain/models"
)

type ActionsRepository struct {
	client HTTPClient
}

func NewActionsRepository(client HTTPClient) *ActionsRepository {
	return &ActionsRepository{client: client}
}

func (a *ActionsRepository) CreateActionsGoogleSheet(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	url, err := getBackendURL("/api/v1/actions/google/sheets")
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

func (a *ActionsRepository) GetGoogleSheetByID(actionID *string, userID *string, serviceUser *string) *string {
	url, err := getPollingURL(fmt.Sprintf("/api/v1/polling/google/sheets/%s/%s", *userID, *actionID))
	if err != nil {
		return nil
	}

	body, err := a.client.DoRequest("GET", url, *serviceUser, nil)
	if err != nil {
		return nil
	}

	var response *string
	if err := json.Unmarshal(body, &response); err != nil {
		return nil
	}

	return response
}
