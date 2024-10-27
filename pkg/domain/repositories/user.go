package repositories

import "minireipaz/pkg/domain/models"

type UserRepository interface {
	CheckExistUser(user *models.Users, serviceUserAccessToken *string) models.ResponseExistUser
}
