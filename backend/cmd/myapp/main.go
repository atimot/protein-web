package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"myapp/internal/handler"
	"myapp/internal/repository"
	"myapp/internal/service"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// TODO: 環境変数から取得する
	dsn := "root:root@tcp(db:3306)/protein"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	repo := repository.NewUserRepository(db)
	svc := service.NewUserService(repo)
	h := handler.NewUserHandler(svc)

	mux := http.NewServeMux()
	mux.HandleFunc("/users", h.GetUsers)

	fmt.Println("Server is running on port 8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
