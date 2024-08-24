package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"minireipaz/pkg/domain/services"
	"net/http"
)

type DashboardController struct {
	service     *services.DashboardService
	authService *services.AuthService
}

func NewDashboardController(dashboardServ *services.DashboardService, authServ *services.AuthService) *DashboardController {
	return &DashboardController{
		service:     dashboardServ,
		authService: authServ,
	}
}

func (d *DashboardController) GetUserDashboardByID(ctx *gin.Context) {
	sub := ctx.Param("iduser")
	userToken := ctx.MustGet("usertoken").(string)
	serviceUserAccessToken, err := d.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	infoDashboard := d.service.GetDashboardInfoByUserID(sub, serviceUserAccessToken, &userToken)
	if infoDashboard.Error != "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  infoDashboard.Error,
			"status": http.StatusInternalServerError,
		})
		return
	}

	ctx.JSON(http.StatusOK, infoDashboard)
}
