package types

// User-specific HTTP request/response types
type RegisterUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name,omitempty"`
}

type RegisterUserResponse struct {
	ID      int     `json:"id"`
	Email   string  `json:"email"`
	Name    *string `json:"name"`
	Message string  `json:"message"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string   `json:"token"`
	User      UserInfo `json:"user"`
	ExpiresAt string   `json:"expires_at"`
	Message   string   `json:"message"`
}

// UserInfo represents the user data for API responses (without sensitive data)
type UserInfo struct {
	ID    int     `json:"id"`
	Email string  `json:"email"`
	Name  *string `json:"name"`
}