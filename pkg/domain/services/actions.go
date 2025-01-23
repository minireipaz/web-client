package services

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
)

type ActionsService struct {
	actionsRepo repositories.ActionsHTTPRepository
}

func NewActionsService(repo repositories.ActionsHTTPRepository) *ActionsService {
	return &ActionsService{actionsRepo: repo}
}

func (a *ActionsService) CreateActionsGoogleSheet(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	// model coupled
	response := a.actionsRepo.CreateActionsGoogleSheet(newAction, serviceUser)
	return response
}

func (a *ActionsService) CreateActionsNotion(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	// model coupled
	response := a.actionsRepo.CreateActionsNotion(newAction, serviceUser)
	return response
}

func (a *ActionsService) GetGoogleSheetByID(actionID *string, userID *string, serviceUser *string) *string {
	// model coupled
	// not needed to retry because polling from frontend
	uriPolling := fmt.Sprintf("/api/v1/polling/google/sheets/%s/%s", *userID, *actionID)
	data := a.actionsRepo.GetActionByID(&uriPolling, actionID, userID, serviceUser)
	return data
}

func (a *ActionsService) GetNotionActionByID(actionID *string, userID *string, serviceUser *string) *string {
	// model coupled
	// not needed to retry because polling from frontend
	uriPolling := fmt.Sprintf("/api/v1/polling/notion/%s/%s", *userID, *actionID)
	data := a.actionsRepo.GetActionByID(&uriPolling, actionID, userID, serviceUser)
	return data
}
