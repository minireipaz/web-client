package config

type EnvZitadelConfig struct{}

type Config interface {
	GetZitadelURI() string
	GetZitadelServiceUserID() string
	GetZitadelServiceUserKeyPrivate() string
	GetZitadelServiceUserKeyID() string
	GetZitadelBackendID() string
	GetZitadelBackendClientID() string
	GetZitadelBackendKeyPrivate() string
	GetZitadelBackendKeyID() string
	GetZitadelKeyServiceUserClientID() string
	GetZitadelKeyClientID() string
	GetZitadelProjectID() string
	GetEnv(key, fallback string) string
}

func (e *EnvZitadelConfig) GetZitadelURI() string {
	return GetEnv("ZITADEL_URI", "")
}

func (e *EnvZitadelConfig) GetZitadelKeyUserID() string {
	return GetEnv("ZITADEL_KEY_USERID", "")
}

func (e *EnvZitadelConfig) GetZitadelKeyPrivate() string {
	return GetEnv("ZITADEL_KEY_PRIVATE", "")
}

func (e *EnvZitadelConfig) GetZitadelKeyID() string {
	return GetEnv("ZITADEL_KEY_KEYID", "")
}

func (e *EnvZitadelConfig) GetEnv(key, fallback string) string {
	return GetEnv(key, fallback)
}

func (e *EnvZitadelConfig) GetZitadelProjectID() string {
	return GetEnv("ZITADEL_PROJECTID", "")
}

func (e *EnvZitadelConfig) GetZitadelKeyServiceUserClientID() string {
	return GetEnv("ZITADEL_KEY_CLIENTID_SERVICE_ACCOUNT", "")
}

func (e *EnvZitadelConfig) GetZitadelServiceUserID() string {
	return GetEnv("ZITADEL_KEY_USERID_SERVICE_ACCOUNT", "")
}

func (e *EnvZitadelConfig) GetZitadelServiceUserKeyPrivate() string {
	return GetEnv("ZITADEL_KEY_PRIVATE_SERVICE_ACCOUNT", "")
}

func (e *EnvZitadelConfig) GetZitadelServiceUserKeyID() string {
	return GetEnv("ZITADEL_KEY_KEYID_SERVICE_ACCOUNT", "")
}

func (e *EnvZitadelConfig) GetZitadelBackendID() string {
	return GetEnv("ZITADEL_KEY_APP_ID_BACKEND", "")
}

func (e *EnvZitadelConfig) GetZitadelBackendKeyPrivate() string {
	return GetEnv("ZITADEL_KEY_PRIVATE_BACKEND", "")
}

func (e *EnvZitadelConfig) GetZitadelBackendKeyID() string {
	return GetEnv("ZITADEL_KEY_KEYID_BACKEND", "")
}

func (e *EnvZitadelConfig) GetZitadelKeyClientID() string {
	return GetEnv("ZITADEL_KEY_CLIENTID", "")
}

func (e *EnvZitadelConfig) GetZitadelBackendClientID() string {
	return GetEnv("ZITADEL_KEY_CLIENTID", "")
}

func NewZitaldelEnvConfig() Config {
	return &EnvZitadelConfig{}
}
