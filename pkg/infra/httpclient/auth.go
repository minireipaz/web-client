package httpclient

type AuthRepository struct {
	client HTTPClient
}

func NewAuthRepository(client HTTPClient) *AuthRepository {
	return &AuthRepository{client: client}
}
