package httpclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/tokenrepo"
	"net/http"
	"time"
)

type ZitadelClient struct {
	apiURL     string
	client     ClientImpl
	userID     string
	privateKey []byte
	keyID      string
}

const (
	twoDays = 48 * time.Hour
)

type TokenResult struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   string `json:"expires_in"`
}

func NewZitadelClient(apiURL, userID, privateKey, keyID string) *ZitadelClient {
	return &ZitadelClient{
		apiURL:     apiURL,
		client:     ClientImpl{}, // &http.Client{Timeout: 10 * time.Second},
		userID:     userID,
		privateKey: []byte(privateKey),
		keyID:      keyID,
	}
}

func (z *ZitadelClient) GetAccessToken(jwt string) (string, time.Duration, error) {
	data := fmt.Sprintf("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&scope=openid&assertion=%s", jwt)
	req, err := http.NewRequest("POST", z.apiURL+"/oauth/v2/token", bytes.NewBufferString(data))
	if err != nil {
		return "", twoDays, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := z.client.Do(req)
	if err != nil {
		return "", twoDays, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", twoDays, fmt.Errorf("ERROR | failed to get access token: %s", resp.Status)
	}

	var result tokenrepo.Token
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", twoDays, fmt.Errorf("ERROR | cannot get decode token: %v", err)
	}

	return result.AccessToken, result.ExpiresIn, nil
}

func (z *ZitadelClient) VerifyUserToken(userToken, authToken string) bool {
	url, err := getBackendURL(fmt.Sprintf("/api/auth/verify/%s", userToken))
	if err != nil {
		return false
	}

	body, err := z.client.DoRequest("GET", url, authToken, nil)
	if err != nil {
		return false
	}

	var tokenValidation models.ResponseVerifyTokenUser
	if err := json.Unmarshal(body, &tokenValidation); err != nil {
		log.Printf("ERROR | error unmarshalling response: %v", err)
		return false
	}

	return tokenValidation.Valid
}
