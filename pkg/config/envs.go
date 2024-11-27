package config

import (
	"log"
	"minireipaz/pkg/common"
	"minireipaz/pkg/vaults"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

func listDirContents(dir string) {
    entries, err := os.ReadDir(dir)
    if err != nil {
        log.Printf("Error reading directory %s: %v", dir, err)
        return
    }
    for _, entry := range entries {
        log.Printf("Entry: %s", entry.Name())
    }
}

func LoadEnvs(baseDir string) {
  currentDir, _ := os.Getwd()
  log.Printf("current dir %v", currentDir)
  listDirContents(currentDir)
	if err := loadCurrentEnv(); err != nil {
		log.Printf("WARNING | Cannot read current .env: %v", err)
		if err := loadBaseEnv(baseDir); err != nil {
			log.Printf("WARNING | Cannot read base .env: %v", err)
			if err := loadLocalEnv(baseDir); err != nil {
				log.Printf("WARNING | Cannot read local .env: %v", err)
				// Try to load envs
				decryptedData, err := loadEnxEnvs("vars.txt", "readmeconcept.md")
				if err != nil {
					log.Printf("ERROR | Initial LoadEnvs FAILED")
					return
				}
				envMap, err := godotenv.UnmarshalBytes(decryptedData)
				if err != nil {
					log.Printf("WARNING | Cannot unmarshal decrypted bytes: %v", err)
					return
				}
				vaults.SetEnvs(envMap)
			}
		}
	}

	// Load environment variables from Vault
	LoadEnvsFromVault()
}

func loadCurrentEnv() error {
	return godotenv.Load()
}

func loadBaseEnv(baseDir string) error {
	envPath := filepath.Join(baseDir, ".env")
	return loadEnvFile(envPath)
}

func loadLocalEnv(baseDir string) error {
	localEnvPath := filepath.Join(baseDir, ".env.local")
	return loadEnvFile(localEnvPath)
}

func loadEnxEnvs(varsFileName, keyFileName string) ([]byte, error) {
	key, err := os.ReadFile(keyFileName)
	if err != nil {
		log.Printf("WARNING | Cannot read key file %s: %v", keyFileName, err)
		return nil, err
	}

	dataByte, err := os.ReadFile(varsFileName)
	if err != nil {
		log.Printf("WARNING | Cannot read vars file %s: %v", varsFileName, err)
		return nil, err
	}

	decryptedText, err := common.DecryptAESGCM(dataByte, key)
	if err != nil {
		log.Printf("WARNING | Cannot decrypt vars file: %v", err)
		return nil, err
	}

	return decryptedText, nil
}

func loadEnvFile(envFilePath string) error {
	if _, err := os.Stat(envFilePath); err != nil {
		return err
	}
	return godotenv.Load(envFilePath)
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
