package api

import (
	"context"

	"github.com/gin-gonic/gin"

	"log"
	"minireipaz/pkg/config"
	"minireipaz/pkg/honeycomb"
	"minireipaz/pkg/middlewares"
	"minireipaz/pkg/routes"
	"net/http"
)

var (
	app *gin.Engine
)

func init() {
	Init()
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}

func RunWebserver() {
	addr := config.GetEnv("FRONTEND_ADDR", ":3010")
	err := app.Run(addr)
	if err != nil {
		log.Panicf("ERROR | Starting gin failed, %v", err)
	}
}

func Init() {
	log.Print("---- Init From LocalInit ----")
	config.LoadEnvs()
	ctx := context.Background()
	tp, exp, err := honeycomb.SetupHoneyComb(ctx)

	// Handle shutdown to ensure all sub processes are closed correctly and telemetry is exported
	defer func() {
		_ = exp.Shutdown(ctx)
		_ = tp.Shutdown(ctx)
	}()

	if err != nil {
		log.Panicf("ERROR | Failed to initialize OpenTelemetry: %v", err)
	}
	gin.SetMode(gin.DebugMode)
	app = gin.New()
	middlewares.Register(app)

	routes.Register(app)
	RunWebserver()
}

func Dummy() {
}
