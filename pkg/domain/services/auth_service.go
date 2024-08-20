package services

import (
	"log"
	"minireipaz/pkg/infra/httpclient"
	"minireipaz/pkg/infra/tokenrepo"
	"time"
)

type AuthService struct {
	tokenRepo     *tokenrepo.TokenRepository
	zitadelClient *httpclient.ZitadelClient
}

func NewAuthService(newTokenRepo *tokenrepo.TokenRepository, newZitadelClient *httpclient.ZitadelClient) *AuthService {
	return &AuthService{
		tokenRepo:     newTokenRepo,
		zitadelClient: newZitadelClient,
	}
}

func (s *AuthService) GetAccessToken() (string, error) {
	existingToken, err := s.tokenRepo.GetToken()
	if err != nil {
		// TODO: better control in case cannot get token auth
		log.Panicf("ERROR | Cannot get token to auth")
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
  authToken, err := s.GetAccessToken()
	if err != nil {
		return false
	}
	isValid := s.zitadelClient.VerifyUserToken(userToken, authToken)
	return isValid
}
