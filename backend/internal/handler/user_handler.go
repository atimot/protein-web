package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"protein-web-backend/internal/service"
	"protein-web-backend/internal/types"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.GetUsers()
	if err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Method not allowed"})
		return
	}

	var req types.RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Invalid JSON format"})
		return
	}

	if strings.TrimSpace(req.Email) == "" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Email is required"})
		return
	}

	if strings.TrimSpace(req.Password) == "" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Password is required"})
		return
	}

	user, err := h.service.RegisterUser(req.Email, req.Password, req.Name)
	if err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		errorMsg := err.Error()
		if strings.Contains(errorMsg, "already exists") {
			w.WriteHeader(http.StatusConflict)
		} else if strings.Contains(errorMsg, "invalid") || strings.Contains(errorMsg, "required") ||
			strings.Contains(errorMsg, "must") {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(w).Encode(types.ErrorResponse{Error: errorMsg})
		return
	}

	response := types.RegisterUserResponse{
		ID:      user.ID,
		Email:   user.Email,
		Name:    user.Name,
		Message: "User registered successfully",
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *UserHandler) LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Method not allowed"})
		return
	}

	var req types.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(types.ErrorResponse{Error: "Invalid JSON format"})
		return
	}

	token, user, err := h.service.LoginUser(req.Email, req.Password)
	if err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		errorMsg := err.Error()
		if strings.Contains(errorMsg, "invalid email or password") {
			w.WriteHeader(http.StatusUnauthorized)
		} else if strings.Contains(errorMsg, "required") || strings.Contains(errorMsg, "invalid") {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}

		json.NewEncoder(w).Encode(types.ErrorResponse{Error: errorMsg})
		return
	}

	response := types.LoginResponse{
		Token: token,
		User: types.UserInfo{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		},
		ExpiresAt: "24h",
		Message:   "Login successful",
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
