package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"protein-web-backend/internal/service"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	
	// Handle preflight requests
	if r.Method == "OPTIONS" {
		return
	}
	
	users, err := h.service.GetUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(users)
}

// RegisterUserRequest represents the registration request payload
type RegisterUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name,omitempty"`
}

// RegisterUserResponse represents the registration response payload
type RegisterUserResponse struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	Name      *string `json:"name"`
	Message   string `json:"message"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// RegisterUser handles user registration
func (h *UserHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	
	// Handle preflight requests
	if r.Method == "OPTIONS" {
		return
	}
	
	// Only allow POST method
	if r.Method != "POST" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Method not allowed"})
		return
	}

	// Parse request body
	var req RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid JSON format"})
		return
	}

	// Validate required fields
	if strings.TrimSpace(req.Email) == "" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Email is required"})
		return
	}

	if strings.TrimSpace(req.Password) == "" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Password is required"})
		return
	}

	// Call service to register user
	user, err := h.service.RegisterUser(req.Email, req.Password, req.Name)
	if err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		
		// Check for specific error types
		errorMsg := err.Error()
		if strings.Contains(errorMsg, "already exists") {
			w.WriteHeader(http.StatusConflict)
		} else if strings.Contains(errorMsg, "invalid") || strings.Contains(errorMsg, "required") || 
				  strings.Contains(errorMsg, "must") {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		
		json.NewEncoder(w).Encode(ErrorResponse{Error: errorMsg})
		return
	}

	// Return success response
	response := RegisterUserResponse{
		ID:      user.ID,
		Email:   user.Email,
		Name:    user.Name,
		Message: "User registered successfully",
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
