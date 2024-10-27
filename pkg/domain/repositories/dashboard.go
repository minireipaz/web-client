package repositories

import "minireipaz/pkg/domain/models"

type DashboardRepository interface {
	GetDashboardInfoByUserID(user *models.Users, serviceUserAccessToken *string) models.ResponseInfoDashboard
}
