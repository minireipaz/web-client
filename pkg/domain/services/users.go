package services

import (
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/repositories"
)

type UserService struct {
	userRepo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) *UserService {
	return &UserService{userRepo: repo}
}

func (s *UserService) ExistUser(user *models.Users, serviceUserAccessToken *string) (response models.ResponseExistUser) {
	response = s.userRepo.CheckExistUser(user, serviceUserAccessToken)
	return response
}
