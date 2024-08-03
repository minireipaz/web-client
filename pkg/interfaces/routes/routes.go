package routes

import (
	"minireipaz/pkg/common"
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/interfaces/controllers"
	"minireipaz/pkg/interfaces/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(app *gin.Engine) {
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

	app.NoRoute(ErrRouter)
	route := app.Group("/api")
	{
		route.GET("/ping", common.Ping)
		route.POST("/workflows", middlewares.ValidateWorkflow(), workflowController.CreateWorkflow)
		// route.GET("/workflows", controllers.GetAllWorkflows)
		// route.GET("/workflows/:id", controllers.GetWorkflowByID)
		// route.PUT("/workflows/:id", controllers.UpdateWorkflow)
		// route.DELETE("/workflows/:id", controllers.DeleteWorkflow)
		route.POST("/users", middlewares.ValidateUser(), userController.SyncUser)
	}
}

func ErrRouter(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"errors": "this page could not be found",
	})
}
