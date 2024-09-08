package services

import (
	"fmt"
	"log"
	"minireipaz/pkg/auth"
	"minireipaz/pkg/common"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/infra/tokenrepo"
	"time"
)

const (
	twoDays = 172_800 * time.Second
)

type AuthService struct {
	jwtGenerator  *auth.JWTGenerator
	tokenRepo     *tokenrepo.TokenRepository
	zitadelClient *httpclient.ZitadelClient
}

func NewAuthService(newTokenRepo *tokenrepo.TokenRepository, newZitadelClient *httpclient.ZitadelClient, jwtGenerator *auth.JWTGenerator) *AuthService {
	return &AuthService{
		jwtGenerator:  jwtGenerator,
		zitadelClient: newZitadelClient,
		tokenRepo:     newTokenRepo,
	}
}

func (s *AuthService) GetServiceUserAccessToken() (*string, error) {
	serviceUserAccessToken, err := s.getAccessToken()
	if err != nil || serviceUserAccessToken == "" {
		return nil, fmt.Errorf("authentication failed")
	}
	return &serviceUserAccessToken, nil
}

func (s *AuthService) getAccessToken() (string, error) {
	existingToken, err := s.tokenRepo.GetToken()
	if err != nil {
		log.Printf("ERROR getaccesstoken %v", err)
		// TODO: better control in case cannot get token auth
		if err.Error() == "no token found" {
			log.Printf("WARN | no token found, generating new one")
			existingToken, err = s.GenerateNewToken()
			if err != nil {
				log.Printf("WARN | failed to generate a new one token, try to read a new one")
				existingToken, err = s.tokenRepo.GetToken()
			}
		}
	}

	if err != nil {
		log.Panicf("ERROR | Cannot get token to auth")
		return "", fmt.Errorf("ERROR | Cannot get token to auth")
	}

	if existingToken != nil {
		if time.Now().After(existingToken.ObtainedAt.Add(existingToken.ExpiresIn * time.Second)) {
			// TODO: better control in case cannot get token auth
			log.Panicf("ERROR | Cannot get token new token expired")
		}
		return existingToken.AccessToken, nil
	}
	// TODO: better control in case cannot get token auth
	return "", nil
}

func (s *AuthService) VerifyUserToken(userToken string) bool {
	serviceUserToken, err := s.getAccessToken()
	if err != nil {
		return false
	}
	for i := 1; i < models.MaxAttempts; i++ {
		isValid, err := s.zitadelClient.VerifyUserToken(userToken, serviceUserToken)
		if err != nil {
			if err.Error() == "connection error" {
				waitTime := common.RandomDuration(models.MaxRangeSleepDuration, models.MinRangeSleepDuration, i)
				log.Printf("WARNING | Connection error (attempt %d) error: %v. Retrying in %v", i, err, waitTime)
				time.Sleep(waitTime)
				continue
			}
			log.Printf("ERROR | cannot verify user token: %v", err)
			return false
		}

		return isValid
	}
	log.Printf("ERROR | Failed to verify user token after %d attempts", models.MaxAttempts)
	return false
}

func (s *AuthService) GenerateNewToken() (*tokenrepo.Token, error) {
	jwt, err := s.jwtGenerator.GenerateServiceUserJWT(twoDays)
	if err != nil {
		log.Panicf("ERROR | Cannot generate JWT %v", err)
	}

	accessToken, expiresIn, err := s.zitadelClient.GetServiceUserAccessToken(jwt)
	if err != nil {
		log.Printf("ERROR | Cannot acces to ACCESS token %v", err)
		return nil, fmt.Errorf("ERROR | Cannot acces to ACCESS token %v", err)
	}

	token := &tokenrepo.Token{
		AccessToken: accessToken,
		ExpiresIn:   expiresIn - models.SaveOffset, // -10 seconds
		ObtainedAt:  time.Now(),
	}

	err = s.tokenRepo.SaveToken(token)
	if err != nil {
		log.Printf("ERROR | Failed to save token, %v", err)
		return nil, fmt.Errorf("ERROR | Failed to save token, %v", err)
	}

	return token, nil
}
