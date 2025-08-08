package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"protein-web-backend/internal/middleware"
	"protein-web-backend/internal/model"
	"protein-web-backend/internal/service"
)

type ReviewHandler struct {
	reviewService service.ReviewService
}

func NewReviewHandler(reviewService service.ReviewService) *ReviewHandler {
	return &ReviewHandler{
		reviewService: reviewService,
	}
}

func (h *ReviewHandler) CreateReview(w http.ResponseWriter, r *http.Request) {
	// Get user ID from context (set by auth middleware)
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req model.CreateReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create review
	review, err := h.reviewService.CreateReview(userID, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert to response format
	response := h.toReviewResponse(review)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *ReviewHandler) GetReview(w http.ResponseWriter, r *http.Request) {
	// Extract ID from path: /api/reviews/{id}
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 {
		http.Error(w, "Invalid review ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[3])
	if err != nil {
		http.Error(w, "Invalid review ID", http.StatusBadRequest)
		return
	}

	review, err := h.reviewService.GetReview(id)
	if err != nil {
		http.Error(w, "Review not found", http.StatusNotFound)
		return
	}

	response := h.toReviewResponse(review)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *ReviewHandler) GetAllReviews(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	limit := 20
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	reviews, err := h.reviewService.GetAllReviews(limit, offset)
	if err != nil {
		http.Error(w, "Failed to get reviews", http.StatusInternalServerError)
		return
	}

	// Convert to response format
	var responses []model.ReviewResponse
	for _, review := range reviews {
		responses = append(responses, *h.toReviewResponse(review))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}

func (h *ReviewHandler) GetUserReviews(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from path: /api/users/{id}/reviews
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Parse query parameters
	limit := 20
	offset := 0

	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	reviews, err := h.reviewService.GetUserReviews(userID, limit, offset)
	if err != nil {
		http.Error(w, "Failed to get user reviews", http.StatusInternalServerError)
		return
	}

	// Convert to response format
	var responses []model.ReviewResponse
	for _, review := range reviews {
		responses = append(responses, *h.toReviewResponse(review))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}

func (h *ReviewHandler) toReviewResponse(review *model.Review) *model.ReviewResponse {
	response := &model.ReviewResponse{
		ID:                review.ID,
		PostedAt:         review.CreatedAt.Format("2006-01-02T15:04:05"),
		ProteinPerServing: review.ProteinPerServing,
		PricePerServing:   review.PricePerServing,
		Comment:           review.Comment,
		Images:            make([]string, 0),
	}

	// Convert user data
	if review.User != nil {
		userName := ""
		if review.User.Name != nil {
			userName = *review.User.Name
		}
		response.User = model.UserResponse{
			ID:   review.User.ID,
			Name: userName,
			// Avatar and Level would be added here if they exist in the User model
		}
	}

	// Convert images
	for _, img := range review.Images {
		response.Images = append(response.Images, img.ImageURL)
	}

	return response
}