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
		key:         "auth:token",
	}
}

// TODO: better control in case cannot get token auth
func (r *TokenRepository) GetToken() (*Token, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if r.token != nil {
		if time.Now().After(r.token.ObtainedAt.Add(r.token.ExpiresIn * time.Second)) {
			return nil, fmt.Errorf("token expired")
		}
		return r.token, nil
	}
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
		return nil, err
	}
	if data == "" {
		return nil, fmt.Errorf("no token found in redis")
	}

	var token Token
	err = json.Unmarshal([]byte(data), &token)
	if err != nil {
		return nil, err
	}

	if time.Now().After(token.ObtainedAt.Add(token.ExpiresIn * time.Second)) {
		return nil, fmt.Errorf("token expired")
	}

	r.token = &token
	return r.token, nil
}

func (r *TokenRepository) SaveToken(token *Token) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	data, err := json.Marshal(token)
	if err != nil {
		return err
	}

	for i := 1; i <= 5; i++ {
		err = r.redisClient.WatchToken(string(data), r.key, token.ExpiresIn)
		if err == nil {
			r.token = token
			return nil
		}
		waitTime := time.Duration(i*i*100) * time.Millisecond // Incremental wait time
		log.Printf("WARNING | Failed to save token, attempt %d: %v. Retrying in %v", i, err, waitTime)
		time.Sleep(waitTime)
	}
	log.Printf("ERROR | Failed to save token, %v", err)
	return err
}
