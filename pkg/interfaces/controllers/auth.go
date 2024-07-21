package controllers

import (
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/redisclient"
	"minireipaz/pkg/infra/tokenrepo"
	"sync"
)

type AuthController struct {
	authService *services.AuthService
}

type AuthContext struct {
	authController *AuthController
	once           sync.Once
}

func NewAuthContext() *AuthContext {
	return &AuthContext{}
}

func (ac *AuthContext) GetAuthController() *AuthController {
	ac.once.Do(func() {
		redisClient := redisclient.NewRedisClient()
		tokenRepo := tokenrepo.NewTokenRepository(redisClient)
		authService := services.NewAuthService(tokenRepo)
		ac.authController = &AuthController{authService: authService}
	})
	return ac.authController
}

func (ac *AuthContext) GetAuthService() *services.AuthService {
	return ac.GetAuthController().authService
}
