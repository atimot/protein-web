package handler

import (
	"encoding/json"
	"net/http"

	"myapp/internal/service"
)

type UserHander struct {
	service service.UserService
}

func NewUserHandler(s service.UserService) *UserHander {
	return &UserHander{service: s}
}

func (h *UserHander) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.GetUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
