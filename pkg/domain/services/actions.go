package services

import (
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
	data := a.actionsRepo.GetGoogleSheetByID(actionID, userID, serviceUser)
	return data
}
