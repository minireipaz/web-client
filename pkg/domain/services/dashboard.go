package services

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/httpclient"
)

// type DashboardService interface {
// 	GetUserDashboardByID(sub string) (*models.ResponseExistUser, error)
// }

type DashboardService struct {
	dashboardRepo *httpclient.DashboardRepository
	userService   *UserService
}

func NewDashboardService(repo *httpclient.DashboardRepository, userServ *UserService) *DashboardService {
	return &DashboardService{dashboardRepo: repo, userService: userServ}
}

func (d *DashboardService) GetDashboardInfoByUserID(sub string, serviceUserAccessToken, userToken *string) (infoDashboard models.ResponseInfoDashboard) {
	defaultUser := &models.Users{
		Sub:         sub,
		AccessToken: *userToken,
	}
	responseExistUser := d.userService.ExistUser(defaultUser, serviceUserAccessToken)
	if responseExistUser.Error != "" {
		infoDashboard.Error = responseExistUser.Error
		return infoDashboard
	}

	if !responseExistUser.Exist {
		infoDashboard.Error = fmt.Sprintf("ERROR | User not exist %s %s", sub, *userToken)
		return infoDashboard
	}

	infoDashboard = d.dashboardRepo.GetDashboardInfoByUserID(defaultUser, serviceUserAccessToken)
	return infoDashboard
}
