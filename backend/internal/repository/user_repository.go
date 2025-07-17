package repository

import (
	"database/sql"
	"myapp/internal/model"
)

type UserRepository interface {
	GetAll() ([]model.User, error)
	Create(user *model.User) error
	GetByEmail(email string) (*model.User, error)
}

type userRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{DB: db}
}

func (r *userRepository) GetAll() ([]model.User, error) {
	rows, err := r.DB.Query("SELECT id, email, password_hash, name, created_at, updated_at FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var user model.User
		var createdAt, updatedAt sql.NullTime
		
		if err := rows.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.Name, &createdAt, &updatedAt); err != nil {
			return nil, err
		}
		
		// Handle nullable timestamps
		if createdAt.Valid {
			user.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			user.UpdatedAt = updatedAt.Time
		}
		
		users = append(users, user)
	}

	return users, nil
}

// Create creates a new user in the database
func (r *userRepository) Create(user *model.User) error {
	query := `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`
	result, err := r.DB.Exec(query, user.Email, user.PasswordHash, user.Name)
	if err != nil {
		return err
	}
	
	// Get the inserted ID
	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	
	user.ID = int(id)
	return nil
}

// GetByEmail retrieves a user by email
func (r *userRepository) GetByEmail(email string) (*model.User, error) {
	query := `SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE email = ?`
	
	var user model.User
	var createdAt, updatedAt sql.NullTime
	
	err := r.DB.QueryRow(query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.Name, &createdAt, &updatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, err
	}
	
	// Handle nullable timestamps
	if createdAt.Valid {
		user.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		user.UpdatedAt = updatedAt.Time
	}
	
	return &user, nil
}
