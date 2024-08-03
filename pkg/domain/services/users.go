package services

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/infra/httpclient"
)

type UserService struct {
	userRepo *httpclient.UserRepository
}

func NewUserService(repo *httpclient.UserRepository) *UserService {
	return &UserService{userRepo: repo}
}

func (s *UserService) ExistUser(user *models.Users, serviceUserAccessToken *string) (response models.ResponseExistUser) {
	response = s.userRepo.CheckExistUser(user, serviceUserAccessToken)
	return response
}
