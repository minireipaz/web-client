package vaults

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

// redis with ctx with timeout ?
var ctx = context.Background()

const (
	PONG = "PONG"
)

func GetAllEnvsFromRedis() string {
  vercel, exist := os.LookupEnv("VERCEL")
  log.Printf("VERCEL exist: %v setted to %s", exist, vercel)
  uriVault, exist := os.LookupEnv("VAULT_URI")
  if !exist {
    log.Printf("VAULT_URI exist: %v setted to %s", exist, uriVault)
  }
  os.Setenv("SALEE", "O NOO")
  log.Printf("All ENVS=%v", os.Environ())
	// uriVault := os.Getenv("VAULT_URI")
  vaulKeyFrontendEnvs := os.Getenv("VAULT_KEY_FRONTEND_ENVS_PROD")
  log.Printf("init vaulKeyFrontendEnvs %s", vaulKeyFrontendEnvs)
	if os.Getenv("GO_ENV") == "dev" {
    vaulKeyFrontendEnvs = os.Getenv("VAULT_KEY_FRONTEND_ENVS_DEV")
	}
  log.Printf("vaulturi %s", uriVault)
  log.Printf("final vaulKeyFrontendEnvs %s", vaulKeyFrontendEnvs)

	if uriVault == "" || vaulKeyFrontendEnvs == "" {
		log.Panic("ERROR | Cannot load initial VAULT_URI")
	}
	opt, err := redis.ParseURL(uriVault)
	if err != nil {
		log.Panicf("ERROR | Cannot parse uri %s error: %v", uriVault, err)
	}
	redisClient := redis.NewClient(opt)
	defer redisClient.Close()

	err = pingRedis(ctx, redisClient)
	if err != nil {
		log.Panic("ERROR | Not possible to ping REDIS vault")
	}

	envsStr, err := getEnvsFromRedis(ctx, redisClient, vaulKeyFrontendEnvs)
	if err != nil {
		log.Panicf("ERROR | Cannot load VAULT_KEY_FRONTEND_ENVS %v DEV? %s", err, os.Getenv("GO_ENV"))
	}
	return envsStr
}

func pingRedis(ctx context.Context, client *redis.Client) error {
	status, err := client.Ping(ctx).Result()
	if err != nil || status != "PONG" {
		log.Panicf("ERROR | Not possible to ping REDIS vault error: %v", err)
	}
	return err
}

func getEnvsFromRedis(ctx context.Context, client *redis.Client, key string) (string, error) {
	envsStr, err := client.Get(ctx, key).Result()
	if err != nil {
		log.Panicf("ERROR | Cannot load VAULT_KEY_FRONTEND_ENVS %v", err)
	}
	return envsStr, err
}
