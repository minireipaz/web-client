package services

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
)

type ActionsService struct {
	actionsRepo repositories.ActionsRepository
}

func NewActionsService(repo repositories.ActionsRepository) *ActionsService {
	return &ActionsService{actionsRepo: repo}
}

func (a *ActionsService) GetGoogleSheetByID(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID {
	response := a.actionsRepo.GetGoogleSheetByID(newAction, serviceUser)
	return response
}
