package services

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
)

type DashboardService struct {
	dashboardRepo repositories.DashboardRepository
	userService   *UserService
}

func NewDashboardService(repo repositories.DashboardRepository, userServ *UserService) *DashboardService {
	return &DashboardService{dashboardRepo: repo, userService: userServ}
}

func (d *DashboardService) GetDashboardInfoByUserID(userID string, serviceUserAccessToken, userToken *string) (infoDashboard models.ResponseInfoDashboard) {
	defaultUser := &models.Users{
		UserID:      userID,
		AccessToken: *userToken,
	}
	responseExistUser := d.userService.ExistUser(defaultUser, serviceUserAccessToken)
	if responseExistUser.Error != "" {
		infoDashboard.Error = responseExistUser.Error
		return infoDashboard
	}

	if !responseExistUser.Exist {
		infoDashboard.Error = fmt.Sprintf("ERROR | User not exist %s %s", userID, *userToken)
		return infoDashboard
	}

	infoDashboard = d.dashboardRepo.GetDashboardInfoByUserID(defaultUser, serviceUserAccessToken)
	return infoDashboard
}
