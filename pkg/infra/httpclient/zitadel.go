package httpclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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
	clientID   string
	projectID  string
}

type TokenResult struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   string `json:"expires_in"`
}

func NewZitadelClient(apiURL, userID, privateKey, keyID, projectID, clientID string) *ZitadelClient {
	return &ZitadelClient{
		apiURL:     apiURL,
		client:     ClientImpl{}, // &http.Client{Timeout: 10 * time.Second},
		userID:     userID,
		privateKey: []byte(privateKey),
		keyID:      keyID,
		projectID:  projectID,
		clientID:   clientID,
	}
}

func (z *ZitadelClient) GetAccessToken(jwt string) (string, time.Duration, error) {
	data := fmt.Sprintf("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&scope=openid&assertion=%s", jwt)
	req, err := http.NewRequest("POST", z.apiURL+"/oauth/v2/token", bytes.NewBufferString(data))
	if err != nil {
		return "", models.TwoDays, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := z.client.Do(req)
	if err != nil {
		return "", models.TwoDays, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", models.TwoDays, fmt.Errorf("ERROR | failed to get access token: %s", resp.Status)
	}

	var result tokenrepo.Token
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", models.TwoDays, fmt.Errorf("ERROR | cannot get decode token: %v", err)
	}

	return result.AccessToken, result.ExpiresIn, nil
}

func (z *ZitadelClient) GetServiceUserAccessToken(jwt string) (string, time.Duration, error) {
	data := fmt.Sprintf(`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&scope='openid profile urn:zitadel:iam:org:project:id:%s:aud'&assertion=%s`, z.projectID, jwt)
	req, err := http.NewRequest("POST", z.apiURL+"/oauth/v2/token", bytes.NewBufferString(data))
	if err != nil {
		return "", models.TwoDays, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := z.client.Do(req)
	if err != nil {
		return "", models.TwoDays, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", models.TwoDays, fmt.Errorf("ERROR | failed to get access token response: %d, body: %s", resp.StatusCode, string(bodyBytes))
	}

	var result tokenrepo.Token
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", models.TwoDays, fmt.Errorf("ERROR | cannot get decode token: %v", err)
	}

	return result.AccessToken, result.ExpiresIn, nil
}

func (z *ZitadelClient) VerifyUserToken(userToken, serviceUserToken string) bool {
	url, err := getBackendURL(fmt.Sprintf("/api/auth/verify/%s", userToken))
	if err != nil {
		log.Printf("ERROR | cannot format correctly with %s error: %v ", url, err)
		return false
	}

	body, err := z.client.DoRequest("GET", url, serviceUserToken, nil)
	if err != nil {
		log.Printf("ERROR | cannot connect with %s error: %v ", url, err)
		return false
	}

	var tokenValidation models.ResponseVerifyTokenUser
	if err := json.Unmarshal(body, &tokenValidation); err != nil {
		log.Printf("ERROR | error unmarshalling response: %v %s", err, string(body))
		return false
	}
	if tokenValidation.Error != "" {
		log.Printf("ERROR | %s", tokenValidation.Error)
	}
	return tokenValidation.Valid
}
