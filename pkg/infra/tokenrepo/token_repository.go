package tokenrepo

import (
	"encoding/json"
	"fmt"
	"log"
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
		key:         "serviceuser:token",
	}
}

// TODO: better control in case cannot get token auth
func (r *TokenRepository) GetToken() (*Token, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if r.token != nil && !r.token.IsExpired() {
		return r.token, nil
	}

	// Token is expired or not found, try to get a new one
	newToken, err := r.GetNewToken()
	if err != nil {
		return nil, err
	}

	r.token = newToken
	return r.token, nil
}

func (r *TokenRepository) GetNewToken() (*Token, error) {
	var data string
	var err error
	for i := 1; i <= 20; i++ {
		data, err = r.redisClient.Get(r.key)
		if data != "" {
			break
		}
		waitTime := time.Duration(i*i*100) * time.Millisecond // Incremental wait time
		log.Printf("WARNING | Failed to get token from vault, attempt %d: %v. Retrying in %v", i, err, waitTime)
		time.Sleep(waitTime)
	}
	if err != nil {
		return nil, fmt.Errorf("ERROR | Failed to retrieve token from Redis: %v", err)
	}
	if data == "" {
		return nil, fmt.Errorf("ERROR | With more than 20 retries, no token found in Redis")
	}

	var token Token
	err = json.Unmarshal([]byte(data), &token)
	if err != nil {
		return nil, fmt.Errorf("ERROR | Failed to unmarshal token data: %v", err)
	}

	return &token, err
}

func (t *Token) IsExpired() bool {
	return time.Now().After(t.ObtainedAt.Add(t.ExpiresIn * time.Second))
}
