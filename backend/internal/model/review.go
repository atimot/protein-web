package model

import (
	"time"
)

type Review struct {
	ID                int            `json:"id"`
	UserID           int            `json:"userId"`
	User             *User          `json:"user,omitempty"`
	ProteinPerServing string         `json:"proteinPerServing"`
	PricePerServing  string         `json:"pricePerServing"`
	Comment          string         `json:"comment"`
	Images           []ReviewImage  `json:"images,omitempty"`
	CreatedAt        time.Time      `json:"postedAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
}

type ReviewImage struct {
	ID           int       `json:"id"`
	ReviewID     int       `json:"reviewId"`
	ImageURL     string    `json:"imageUrl"`
	DisplayOrder int       `json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`
}

type CreateReviewRequest struct {
	ProteinPerServing string   `json:"proteinPerServing" validate:"required"`
	PricePerServing  string   `json:"pricePerServing" validate:"required"`
	Comment          string   `json:"comment" validate:"required"`
	Images           []string `json:"images"`
}

type ReviewResponse struct {
	ID                int            `json:"id"`
	User              UserResponse   `json:"user"`
	PostedAt         string         `json:"postedAt"`
	Images           []string       `json:"images"`
	ProteinPerServing string         `json:"proteinPerServing"`
	PricePerServing  string         `json:"pricePerServing"`
	Comment          string         `json:"comment"`
}

type UserResponse struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Avatar string `json:"avatar,omitempty"`
	Level  string `json:"level,omitempty"`
}