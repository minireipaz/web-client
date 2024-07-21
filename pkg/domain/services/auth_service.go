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
		log.Panicf("ERROR | Cannot get token to auth")
	}

	if existingToken != nil {
		if time.Now().After(existingToken.ObtainedAt.Add(existingToken.ExpiresIn * time.Second)) {
			log.Panicf("ERROR | Cannot get token new token expired")
		}
		return existingToken.AccessToken, nil
	}

	return "", nil
}
