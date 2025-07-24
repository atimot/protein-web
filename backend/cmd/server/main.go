package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"protein-web-backend/internal/factory"

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

	fmt.Println("Server is running on port 8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
