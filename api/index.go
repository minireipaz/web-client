package api

import (
	"minireipaz/pkg/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

var (
	app *gin.Engine
)

func init() {
	gin.SetMode(gin.DebugMode)
	app = gin.New()

	// middlewares

	// routes
	routes.Register(app)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}

func LocalRun(addr string) error {
	return app.Run(addr)
}
