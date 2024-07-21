package middlewares

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

func Register(app *gin.Engine) {
	app.Use(otelgin.Middleware("server-frontend"))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3020", "http://localhost:3010"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))
}
