package main

import (
	"log"
	"minireipaz/api"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("ERROR | Cannot load Envs")
	}
	addr := os.Getenv("FRONTEND_ADDR")
	if err := api.LocalRun(addr); err != nil {
		log.Fatal(err)
	}
}
