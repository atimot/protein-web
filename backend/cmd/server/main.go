package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"protein-web-backend/internal/factory"
	"protein-web-backend/internal/middleware"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4", dbUser, dbPassword, dbHost, dbPort, dbName)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	// Initialize application components using Factory
	appFactory := factory.New(db)
	_, _, handlers := appFactory.NewAppComponents()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/users", handlers.User.GetUsers)
	mux.HandleFunc("/api/register", handlers.User.RegisterUser)
	mux.HandleFunc("/api/login", handlers.User.LoginUser)

	// Review endpoints
	mux.HandleFunc("/api/reviews", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			// Apply auth middleware to POST requests
			middleware.AuthMiddleware(handlers.Review.CreateReview)(w, r)
		case http.MethodGet:
			handlers.Review.GetAllReviews(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/api/reviews/", handlers.Review.GetReview)
	mux.HandleFunc("/api/users/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/reviews") {
			handlers.Review.GetUserReviews(w, r)
		} else {
			http.Error(w, "Not found", http.StatusNotFound)
		}
	})

	corsHandler := middleware.CORSMiddleware(mux)

	fmt.Println("Server is running on port 8080")
	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
		log.Fatal(err)
	}
}
