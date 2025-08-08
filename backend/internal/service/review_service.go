package service

import (
	"fmt"

	"protein-web-backend/internal/model"
	"protein-web-backend/internal/repository"
)

type ReviewService interface {
	CreateReview(userID int, req *model.CreateReviewRequest) (*model.Review, error)
	GetReview(id int) (*model.Review, error)
	GetAllReviews(limit, offset int) ([]*model.Review, error)
	GetUserReviews(userID int, limit, offset int) ([]*model.Review, error)
}

type reviewService struct {
	reviewRepo repository.ReviewRepository
	userRepo   repository.UserRepository
}

func NewReviewService(reviewRepo repository.ReviewRepository, userRepo repository.UserRepository) ReviewService {
	return &reviewService{
		reviewRepo: reviewRepo,
		userRepo:   userRepo,
	}
}

func (s *reviewService) CreateReview(userID int, req *model.CreateReviewRequest) (*model.Review, error) {
	// Validate user exists
	_, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	// Create review
	review := &model.Review{
		UserID:            userID,
		ProteinPerServing: req.ProteinPerServing,
		PricePerServing:   req.PricePerServing,
		Comment:           req.Comment,
	}

	err = s.reviewRepo.Create(review)
	if err != nil {
		return nil, fmt.Errorf("failed to create review: %w", err)
	}

	// Create images
	for i, imageURL := range req.Images {
		image := &model.ReviewImage{
			ReviewID:     review.ID,
			ImageURL:     imageURL,
			DisplayOrder: i,
		}
		err = s.reviewRepo.CreateImage(image)
		if err != nil {
			return nil, fmt.Errorf("failed to create review image: %w", err)
		}
		review.Images = append(review.Images, *image)
	}

	// Get full review with user data
	fullReview, err := s.GetReview(review.ID)
	if err != nil {
		return nil, err
	}

	return fullReview, nil
}

func (s *reviewService) GetReview(id int) (*model.Review, error) {
	review, err := s.reviewRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Get user data
	user, err := s.userRepo.GetByID(review.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user data: %w", err)
	}
	review.User = user

	return review, nil
}

func (s *reviewService) GetAllReviews(limit, offset int) ([]*model.Review, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	reviews, err := s.reviewRepo.GetAll(limit, offset)
	if err != nil {
		return nil, err
	}

	return reviews, nil
}

func (s *reviewService) GetUserReviews(userID int, limit, offset int) ([]*model.Review, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	reviews, err := s.reviewRepo.GetByUserID(userID, limit, offset)
	if err != nil {
		return nil, err
	}

	// Get user data for all reviews
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user data: %w", err)
	}

	for _, review := range reviews {
		review.User = user
	}

	return reviews, nil
}