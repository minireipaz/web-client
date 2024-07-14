package routes

import (
	"minireipaz/pkg/common"
	"minireipaz/pkg/interfaces/workflowcontrollers"

	"minireipaz/pkg/middlewares"
	"minireipaz/pkg/users"

	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(app *gin.Engine) {
	app.NoRoute(ErrRouter)
	route := app.Group("/api")
	{
		route.GET("/ping", common.Ping)
		route.POST("/workflows", middlewares.ValidateWorkflow(), workflowcontrollers.CreateWorkflow)
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
