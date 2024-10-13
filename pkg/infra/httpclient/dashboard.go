package httpclient

import (
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
)

type DashboardRepository struct {
	client HTTPClient
}

func NewDashboardRepository(client HTTPClient) *DashboardRepository {
	return &DashboardRepository{client: client}
}

func (d *DashboardRepository) GetDashboardInfoByUserID(user *models.Users, serviceUserAccessToken *string) models.ResponseInfoDashboard {
	url, err := getBackendURL(fmt.Sprintf("/api/dashboard/%s", user.UserID))
	if err != nil {
		return models.ResponseInfoDashboard{
			Error: err.Error(),
		}
	}

	body, err := d.client.DoRequest("GET", url, *serviceUserAccessToken, nil)
	if err != nil {
		return models.ResponseInfoDashboard{
			Error: err.Error(),
		}
	}

	var infoDashboard models.ResponseInfoDashboard
	if err := json.Unmarshal(body, &infoDashboard); err != nil {
		log.Printf("ERROR | error unmarshalling response: %v", err)
		return models.ResponseInfoDashboard{
			Error: fmt.Sprintf("ERROR | error unmarshalling response: %v", err),
		}
	}

	return infoDashboard
}
