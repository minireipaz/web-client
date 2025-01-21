package routes

import (
	"minireipaz/pkg/common"
	"minireipaz/pkg/interfaces/controllers"
	"minireipaz/pkg/interfaces/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(app *gin.Engine,
	workflowController *controllers.WorkflowController,
	userController *controllers.UserController,
	dashboardController *controllers.DashboardController,
	credentialController *controllers.CredentialsController,
	actionsController *controllers.ActionsController,
) {
	app.NoRoute(ErrRouter)
	route := app.Group("/api/v1")
	{
		route.GET("/ping", common.Ping)
		route.POST("/workflows", middlewares.ValidateWorkflow(), workflowController.CreateWorkflow)
		route.GET("/workflows/:iduser", middlewares.ValidateUserID(), workflowController.GetAllWorkflows)
		route.GET("/workflows/:iduser/:idworkflow", middlewares.ValidateGetWorkflow(), workflowController.GetWorkflowByID)
		route.PUT("/workflows/:iduser/:idworkflow", middlewares.ValidateUpdateWorkflow(), workflowController.UpdateWorkflow)
		route.POST("/users", middlewares.ValidateUser(), userController.SyncUser)
		route.GET("/dashboard/:iduser", middlewares.ValidateUserID(), dashboardController.GetUserDashboardByID)

		route.POST("/credentials", middlewares.ValidateTokenCredential(), credentialController.CreateCredentials)
		route.POST("/oauth-credentials", middlewares.ValidateOAuthCredential(), credentialController.CreateOAuthCredentials)
		route.GET("/credentials/:iduser", middlewares.ValidateUserID(), credentialController.GetAllCredentials)
		// route.GET("/credentials/:iduser/:idcredential", middlewares.ValidateGetCredential(), credentialController.GetCredentialsByID)
	}
  // paths outside /api/v1/...
	creds := app.Group("/oauth2-credentials")
	{
		creds.POST("/save", middlewares.ValidateCredentialExchange(), credentialController.CallbackCredentials)
	}

	actions := app.Group("/actions")
	{
		actions.POST("/google/sheets", middlewares.ValidateGetGoogleSheet(), actionsController.CreateActionsGoogleSheet)
		actions.GET("/google/sheets/:iduser/:idaction", middlewares.ValidateUserID(), middlewares.ValidateIDAction(), actionsController.PollingGetGoogleSheetByID)
    actions.POST("/notion", middlewares.ValidateNotionFields(), actionsController.CreateNotionAction )
    actions.GET("/notion/:type:/:iduser/:idaction", middlewares.ValidateUserID(), middlewares.ValidateIDAction(), actionsController.PollingGetNotionByID)
	}
}

func ErrRouter(ctx *gin.Context) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"meta": gin.H{
			"code":    http.StatusBadRequest,
			"message": "Bad Request",
			"time":    common.GetUTCTimeInMillis(),
		},
		"status": http.StatusBadRequest,
		"error":  "this page could not be found",
		// "data": gin.H{
		// },
	})
}
