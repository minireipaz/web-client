package repositories

import "minireipaz/pkg/domain/models"

type ActionsHTTPRepository interface {
	CreateActionsGoogleSheet(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
	GetGoogleSheetByID(actionID *string, userID *string, serviceUser *string) *string
	CreateActionsNotion(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
}
