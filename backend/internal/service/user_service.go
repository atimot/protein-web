package service

import (
	"errors"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"protein-web-backend/internal/model"
	"protein-web-backend/internal/repository"
)

type UserService interface {
	GetUsers() ([]model.User, error)
	RegisterUser(email, password, name string) (*model.User, error)
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

// RegisterUser creates a new user with validation and password hashing
func (s *userService) RegisterUser(email, password, name string) (*model.User, error) {
	// Validate input
	if err := s.validateRegistrationInput(email, password); err != nil {
		return nil, err
	}

	// Check if user already exists
	existingUser, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user model
	user := &model.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
	}
	
	// Set name if provided
	if strings.TrimSpace(name) != "" {
		user.Name = &name
	}

	// Save to database
	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

// validateRegistrationInput validates email and password
func (s *userService) validateRegistrationInput(email, password string) error {
	// Email validation
	if strings.TrimSpace(email) == "" {
		return errors.New("email is required")
	}
	
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return errors.New("invalid email format")
	}

	// Password validation
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	// Check password complexity
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasDigit := regexp.MustCompile(`\d`).MatchString(password)

	if !hasUpper || !hasLower || !hasDigit {
		return errors.New("password must contain at least one uppercase letter, one lowercase letter, and one digit")
	}

	return nil
}
