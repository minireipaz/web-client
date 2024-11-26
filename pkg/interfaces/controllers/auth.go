package controllers

import (
	"minireipaz/pkg/auth"
	"minireipaz/pkg/config"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"minireipaz/pkg/infra/httpclient"
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
		configZitadel := config.NewZitaldelEnvConfig()
		zitadelClient := httpclient.NewZitadelClient(
			configZitadel.GetZitadelURI(),
			configZitadel.GetZitadelServiceUserID(),
			configZitadel.GetZitadelServiceUserKeyPrivate(),
			configZitadel.GetZitadelServiceUserKeyID(),
			configZitadel.GetZitadelProjectID(),
			configZitadel.GetZitadelKeyServiceUserClientID(),
		)

		jwtGenerator := auth.NewJWTGenerator(auth.JWTGeneratorConfig{
			ServiceUser: auth.ServiceUserConfig{
				UserID:     configZitadel.GetZitadelServiceUserID(),
				PrivateKey: []byte(configZitadel.GetZitadelServiceUserKeyPrivate()),
				KeyID:      configZitadel.GetZitadelServiceUserKeyID(),
				ClientID:   configZitadel.GetZitadelKeyServiceUserClientID(),
			},
			BackendApp: auth.BackendAppConfig{
				KeyID:      configZitadel.GetZitadelBackendKeyID(),
				PrivateKey: []byte(configZitadel.GetZitadelBackendKeyPrivate()),
				AppID:      configZitadel.GetZitadelBackendID(),
				ClientID:   configZitadel.GetZitadelBackendClientID(),
			},
			APIURL:    configZitadel.GetZitadelURI(),
			ProjectID: configZitadel.GetZitadelProjectID(),
			ClientID:  configZitadel.GetZitadelKeyClientID(),
		})

		redisClient := redisclient.NewRedisClient()
		tokenRepo := tokenrepo.NewTokenRepository(redisClient)
		authHTTPClient := httpclient.NewClientImpl(models.TimeoutRequest)
		authHTTPRepo := httpclient.NewAuthRepository(authHTTPClient)
		authService := services.NewAuthService(tokenRepo, zitadelClient, jwtGenerator, authHTTPRepo)
		ac.authController = &AuthController{authService: authService}
	})
	return ac.authController
}

func (ac *AuthContext) GetAuthService() *services.AuthService {
	return ac.GetAuthController().authService
}
