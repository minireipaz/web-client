package config

import (
	"log"
	"minireipaz/internal/vaults"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvs() {
	if err := godotenv.Load(); err != nil {
		log.Panic("ERROR | Initial LoadEnvs FAILED")
	}
	LoadEnvsFromVault()
}

func LoadEnvsFromVault() {
	vaults.GetEnvsFromVault()
}

func GetEnv(key, fallback string) string {
	if value, exist := os.LookupEnv(key); exist {
		return value
	}
	return fallback
}
