package service

import (
	"myapp/internal/model"
	"myapp/internal/repository"
)

type UserService interface {
	GetUsers() ([]model.User, error)
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{repo: r}
}

func (s *userService) GetUsers() ([]model.User, error) {
	return s.repo.GetAll()
}
