package repository

import (
	"database/sql"
	"fmt"

	"protein-web-backend/internal/model"
)

type ReviewRepository interface {
	Create(review *model.Review) error
	CreateImage(image *model.ReviewImage) error
	GetByID(id int) (*model.Review, error)
	GetAll(limit, offset int) ([]*model.Review, error)
	GetByUserID(userID int, limit, offset int) ([]*model.Review, error)
}

type reviewRepository struct {
	db *sql.DB
}

func NewReviewRepository(db *sql.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(review *model.Review) error {
	query := `
		INSERT INTO reviews (user_id, protein_per_serving, price_per_serving, comment)
		VALUES (?, ?, ?, ?)
	`
	result, err := r.db.Exec(query, review.UserID, review.ProteinPerServing, review.PricePerServing, review.Comment)
	if err != nil {
		return fmt.Errorf("failed to create review: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}

	review.ID = int(id)
	return nil
}

func (r *reviewRepository) CreateImage(image *model.ReviewImage) error {
	query := `
		INSERT INTO review_images (review_id, image_url, display_order)
		VALUES (?, ?, ?)
	`
	result, err := r.db.Exec(query, image.ReviewID, image.ImageURL, image.DisplayOrder)
	if err != nil {
		return fmt.Errorf("failed to create review image: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}

	image.ID = int(id)
	return nil
}

func (r *reviewRepository) GetByID(id int) (*model.Review, error) {
	review := &model.Review{}
	query := `
		SELECT id, user_id, protein_per_serving, price_per_serving, comment, created_at, updated_at
		FROM reviews
		WHERE id = ?
	`
	err := r.db.QueryRow(query, id).Scan(
		&review.ID,
		&review.UserID,
		&review.ProteinPerServing,
		&review.PricePerServing,
		&review.Comment,
		&review.CreatedAt,
		&review.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("review not found")
		}
		return nil, fmt.Errorf("failed to get review: %w", err)
	}

	// Get images
	images, err := r.getImagesByReviewID(review.ID)
	if err != nil {
		return nil, err
	}
	review.Images = images

	return review, nil
}

func (r *reviewRepository) GetAll(limit, offset int) ([]*model.Review, error) {
	query := `
		SELECT r.id, r.user_id, r.protein_per_serving, r.price_per_serving, r.comment, r.created_at, r.updated_at,
		       u.id, u.name, u.email
		FROM reviews r
		JOIN users u ON r.user_id = u.id
		ORDER BY r.created_at DESC
		LIMIT ? OFFSET ?
	`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get reviews: %w", err)
	}
	defer rows.Close()

	var reviews []*model.Review
	for rows.Next() {
		review := &model.Review{User: &model.User{}}
		err := rows.Scan(
			&review.ID,
			&review.UserID,
			&review.ProteinPerServing,
			&review.PricePerServing,
			&review.Comment,
			&review.CreatedAt,
			&review.UpdatedAt,
			&review.User.ID,
			&review.User.Name,
			&review.User.Email,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan review: %w", err)
		}

		// Get images for each review
		images, err := r.getImagesByReviewID(review.ID)
		if err != nil {
			return nil, err
		}
		review.Images = images

		reviews = append(reviews, review)
	}

	return reviews, nil
}

func (r *reviewRepository) GetByUserID(userID int, limit, offset int) ([]*model.Review, error) {
	query := `
		SELECT id, user_id, protein_per_serving, price_per_serving, comment, created_at, updated_at
		FROM reviews
		WHERE user_id = ?
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?
	`
	rows, err := r.db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get reviews by user: %w", err)
	}
	defer rows.Close()

	var reviews []*model.Review
	for rows.Next() {
		review := &model.Review{}
		err := rows.Scan(
			&review.ID,
			&review.UserID,
			&review.ProteinPerServing,
			&review.PricePerServing,
			&review.Comment,
			&review.CreatedAt,
			&review.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan review: %w", err)
		}

		// Get images for each review
		images, err := r.getImagesByReviewID(review.ID)
		if err != nil {
			return nil, err
		}
		review.Images = images

		reviews = append(reviews, review)
	}

	return reviews, nil
}

func (r *reviewRepository) getImagesByReviewID(reviewID int) ([]model.ReviewImage, error) {
	query := `
		SELECT id, review_id, image_url, display_order, created_at
		FROM review_images
		WHERE review_id = ?
		ORDER BY display_order
	`
	rows, err := r.db.Query(query, reviewID)
	if err != nil {
		return nil, fmt.Errorf("failed to get review images: %w", err)
	}
	defer rows.Close()

	var images []model.ReviewImage
	for rows.Next() {
		var image model.ReviewImage
		err := rows.Scan(
			&image.ID,
			&image.ReviewID,
			&image.ImageURL,
			&image.DisplayOrder,
			&image.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan review image: %w", err)
		}
		images = append(images, image)
	}

	return images, nil
}