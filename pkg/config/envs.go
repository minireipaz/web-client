package config

import (
	"log"
	"minireipaz/pkg/vaults"
	"os"
	// "path/filepath"

	"github.com/joho/godotenv"
)

func LoadEnvs(baseDir string) {
	log.Printf("basedir %s", baseDir)
	if err := godotenv.Load(); err != nil {
		log.Printf("WARNING | Cannot read .env %v", err)
		// envPath := filepath.Join(baseDir, ".env")
		// if err := loadEnvFile(envPath); err != nil {
		// 	log.Printf("WARNING | Cannot read envPath %s %v", envPath, err)
		// 	localEnvPath := filepath.Join(baseDir, ".env.local")
		// 	if err := loadEnvFile(localEnvPath); err != nil {
		// 		log.Printf("ERROR | Initial LoadEnvs FAILED")
		// 	}
		// }
	}

	LoadEnvsFromVault()
}

func loadEnvFile(envFilePath string) error {
	if _, err := os.Stat(envFilePath); err == nil {
		if err := godotenv.Load(envFilePath); err != nil {
			log.Printf("WARNING | Could not load .env file at %s: %v", envFilePath, err)
			return err
		}
	}
	return nil
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
