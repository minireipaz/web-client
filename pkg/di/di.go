package di

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/interfaces/controllers"
)

func InitDependencies() (*controllers.WorkflowController, *services.AuthService, *controllers.UserController, *controllers.DashboardController, *controllers.CredentialsController) {
	authContext := controllers.NewAuthContext()
	authContext.GetAuthController()
	authService := authContext.GetAuthService()

	// client workflow
	workflowHTTPClient := httpclient.NewClientImpl(models.TimeoutRequest)
	workflowRepo := httpclient.NewWorkflowRepository(workflowHTTPClient)
	workflowService := services.NewWorkflowService(workflowRepo)
	workflowController := controllers.NewWorkflowController(workflowService, authService)

	userHTTPClient := httpclient.NewClientImpl(models.TimeoutRequest)
	userRepo := httpclient.NewUserRepository(userHTTPClient)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService, authService)

	dashboardHTTPClient := httpclient.NewClientImpl(models.TimeoutRequest)
	dashboardRepo := httpclient.NewDashboardRepository(dashboardHTTPClient)
	dashboardService := services.NewDashboardService(dashboardRepo, userService)
	dashboardController := controllers.NewDashboardController(dashboardService, authService)

	credentialsHTTPClient := httpclient.NewClientImpl(models.TimeoutRequest)
	credentialsRepo := httpclient.NewCredentialsRepository(credentialsHTTPClient)
	credentialsService := services.NewCredentialsService(credentialsRepo)
	credentialsController := controllers.NewCredentialsController(credentialsService, authService)

	return workflowController, authService, userController, dashboardController, credentialsController
}
