package services

import (
	"log"
	"minireipaz/pkg/infra/tokenrepo"
	"time"
)

type AuthService struct {
	tokenRepo *tokenrepo.TokenRepository
}

func NewAuthService(tokenRepo *tokenrepo.TokenRepository) *AuthService {
	return &AuthService{
		tokenRepo: tokenRepo,
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
