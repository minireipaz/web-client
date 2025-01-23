package repositories

import "minireipaz/pkg/domain/models"

type ActionsHTTPRepository interface {
	CreateActionsGoogleSheet(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
	GetActionByID(uriPolling *string, actionID *string, userID *string, serviceUser *string) *string
	CreateActionsNotion(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
}
