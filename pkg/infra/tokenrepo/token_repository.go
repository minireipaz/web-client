package tokenrepo

import (
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/common"
	"minireipaz/pkg/config"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/redisclient"
	"sync"
	"time"
)

type Token struct {
	ObtainedAt  time.Time     `json:"obtained_at"`
	AccessToken string        `json:"access_token"`
	TokenType   string        `json:"token_type"`
	ExpiresIn   time.Duration `json:"expires_in"`
}

type TokenRepository struct {
	mu          sync.RWMutex
	redisClient *redisclient.RedisClient
	key         string
	token       *Token
}

func NewTokenRepository(redisClient *redisclient.RedisClient) *TokenRepository {
	return &TokenRepository{
		redisClient: redisClient,
		key:         "serviceuser_backend:token",
	}
}

// TODO: better control in case cannot get token auth
func (r *TokenRepository) GetToken() (*Token, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if r.token != nil && !r.isExpired(r.token) {
		return r.token, nil
	}

	// Local Token is expired or not found, try to get cached token
	cachedToken, err := r.GetCachedToken()
	if err != nil {
		return nil, err
	}

	if cachedToken != nil && r.isExpired(cachedToken) {
		return nil, fmt.Errorf("no token found")
	}

	r.token = cachedToken
	return r.token, nil
}

func (r *TokenRepository) GetCachedToken() (*Token, error) {
	var data string
	var err error
	for i := 1; i <= models.MaxAttempts; i++ {
		data, err = r.redisClient.Get(r.key)
		if data != "" {
			break
		}
		if data == "" {
			// time to obtain new token for service user that expire every 2 days
			return nil, fmt.Errorf("no token found")
		}
		waitTime := time.Duration(i*i*100) * time.Millisecond // Incremental wait time
		log.Printf("WARNING | Failed to get token from vault, attempt %d error: %v. Retrying in %v", i, err, waitTime)
		time.Sleep(waitTime)
	}
	if err != nil {
		return nil, fmt.Errorf("ERROR | Failed to retrieve token from Redis: %v", err)
	}
	if data == "" {
		return nil, fmt.Errorf("ERROR | With more than 10 retries, no token found in Redis")
	}

	var token Token
	err = json.Unmarshal([]byte(data), &token)
	if err != nil {
		return nil, fmt.Errorf("ERROR | Failed to unmarshal token data: %v", err)
	}

	return &token, err
}

func (r *TokenRepository) isExpired(token *Token) bool {
	if config.GetEnv("ROTATE_SERVICE_USER_TOKEN", "n") == "y" {
		if time.Now().UTC().After(token.ObtainedAt.Add(token.ExpiresIn * time.Second)) {
			return true
		}
	}
	return false
}

func (r *TokenRepository) SaveToken(token *Token) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	data, err := json.Marshal(token)
	if err != nil {
		return err
	}

	for i := 1; i <= models.MaxAttempts; i++ {
		err = r.redisClient.WatchToken(string(data), r.key, (token.ExpiresIn)*time.Second)
		if err == nil {
			r.token = token
			return nil
		}
		// if err == redis.Nil { // in really rare xtreme cases
		//   r.redisClient.Set(r.key, "")
		// }
		waitTime := common.RandomDuration(models.MaxRangeSleepDuration, models.MinRangeSleepDuration, i)
		log.Printf("WARNING | Failed to save token, attempt %d: %v. Retrying in %v", i, err, waitTime)
		time.Sleep(waitTime)
	}
	log.Printf("ERROR | Failed to save token, %v", err)
	return err
}
