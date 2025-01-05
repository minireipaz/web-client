package repositories

import "minireipaz/pkg/domain/models"

type ActionsRepository interface {
	CreateActionsGoogleSheet(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
	GetGoogleSheetByID(actionID *string, userID *string, serviceUser *string) *string
}
