package routes

import (
	"minireipaz/pkg/common"
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/interfaces/controllers"
	"minireipaz/pkg/interfaces/middlewares"
	"minireipaz/pkg/users"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(app *gin.Engine) {
	authContext := controllers.NewAuthContext()
	authContext.GetAuthController()
	authService := authContext.GetAuthService()

	// client workflow
	workflowHTTPClient := &httpclient.HttpClientImpl{}
	workflowRepo := httpclient.NewWorkflowRepository(workflowHTTPClient)
	workflowService := services.NewWorkflowService(workflowRepo)
	workflowController := controllers.NewWorkflowController(workflowService, authService)

	app.NoRoute(ErrRouter)
	route := app.Group("/api")
	{
		route.GET("/ping", common.Ping)
		route.POST("/workflows", middlewares.ValidateWorkflow(), workflowController.CreateWorkflow)
		// route.GET("/workflows", controllers.GetAllWorkflows)
		// route.GET("/workflows/:id", controllers.GetWorkflowByID)
		// route.PUT("/workflows/:id", controllers.UpdateWorkflow)
		// route.DELETE("/workflows/:id", controllers.DeleteWorkflow)
		route.GET("/users/:name", users.HandleUsers)
	}
}

func ErrRouter(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"errors": "this page could not be found",
	})
}
