package repositories

import "minireipaz/pkg/domain/models"

type ActionsRepository interface {
	GetGoogleSheetByID(newAction models.RequestGoogleAction, serviceUser *string) *models.ResponseGetGoogleSheetByID
}
