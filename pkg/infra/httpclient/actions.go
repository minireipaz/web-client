package httpclient

import (
	"encoding/json"
	"log"
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

func (a *ActionsRepository) CreateActionsNotion(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	url, err := getBackendURL("/api/v1/actions/notion") // maybe uri for oauth or same uri for both ?
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

func (a *ActionsRepository) GetActionByID(uriPolling *string, actionID *string, userID *string, serviceUser *string) *string {
	url, err := getPollingURL(*uriPolling)
	if err != nil {
		return nil
	}
	body, err := a.client.DoRequest("GET", url, *serviceUser, nil)
	if err != nil {
		log.Printf("ERROR | GetGoogleSheetByID cannot get response from action %v for actionID %s and userID %s", err, *actionID, *userID)
		return nil
	}

	if len(body) == 0 {
		log.Printf("body empty %v for actionID %s and userID %s", string(body), *actionID, *userID)
		return nil
	}
	responseString := string(body)
	return &responseString
}
