package di

import (
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/interfaces/controllers"
)

func InitDependencies() (*controllers.WorkflowController, *services.AuthService, *controllers.UserController, *controllers.DashboardController) {
	authContext := controllers.NewAuthContext()
	authContext.GetAuthController()
	authService := authContext.GetAuthService()

	// client workflow
	workflowHTTPClient := &httpclient.ClientImpl{}
	workflowRepo := httpclient.NewWorkflowRepository(workflowHTTPClient)
	workflowService := services.NewWorkflowService(workflowRepo)
	workflowController := controllers.NewWorkflowController(workflowService, authService)

	userHTTPClient := &httpclient.ClientImpl{}
	userRepo := httpclient.NewUserRepository(userHTTPClient)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService, authService)

	dashboardHTTPClient := &httpclient.ClientImpl{}
	dashboardRepo := httpclient.NewDashboardRepository(dashboardHTTPClient)
	dashboardService := services.NewDashboardService(dashboardRepo, userService)
	dashboardController := controllers.NewDashboardController(dashboardService, authService)

	return workflowController, authService, userController, dashboardController
}
