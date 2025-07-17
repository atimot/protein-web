package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"protein-web-backend/internal/migration"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	var (
		action = flag.String("action", "up", "Migration action: up, down, status")
		envFile = flag.String("env", ".env", "Environment file path")
	)
	flag.Parse()

	// Load environment variables
	err := godotenv.Load(*envFile)
	if err != nil {
		log.Printf("Warning: Error loading %s file: %v", *envFile, err)
	}

	// Database connection
	db, err := connectDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Migration runner
	migrationsDir := filepath.Join(".", "migrations")
	migrationRunner := migration.NewRunner(db, migrationsDir)

	switch *action {
	case "up":
		if err := migrationRunner.Run(); err != nil {
			log.Fatal("Migration up failed:", err)
		}
		fmt.Println("Migrations completed successfully")

	case "down":
		if err := migrationRunner.Rollback(); err != nil {
			log.Fatal("Migration rollback failed:", err)
		}
		fmt.Println("Migration rolled back successfully")

	case "status":
		if err := showMigrationStatus(db); err != nil {
			log.Fatal("Failed to show migration status:", err)
		}

	default:
		fmt.Printf("Unknown action: %s\n", *action)
		fmt.Println("Available actions: up, down, status")
		os.Exit(1)
	}
}

func connectDatabase() (*sql.DB, error) {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		return nil, fmt.Errorf("missing required database environment variables")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4", 
		dbUser, dbPassword, dbHost, dbPort, dbName)
	
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func showMigrationStatus(db *sql.DB) error {
	// Check if migration_history table exists
	var tableExists bool
	query := `SELECT COUNT(*) > 0 FROM information_schema.tables 
			  WHERE table_schema = DATABASE() AND table_name = 'migration_history'`
	
	err := db.QueryRow(query).Scan(&tableExists)
	if err != nil {
		return err
	}

	if !tableExists {
		fmt.Println("Migration history table does not exist. No migrations have been run.")
		return nil
	}

	// Get applied migrations
	rows, err := db.Query("SELECT version, filename, applied_at FROM migration_history ORDER BY version")
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Println("Applied migrations:")
	fmt.Println("Version | Filename | Applied At")
	fmt.Println("--------|----------|------------")

	for rows.Next() {
		var version int
		var filename string
		var appliedAt string
		
		if err := rows.Scan(&version, &filename, &appliedAt); err != nil {
			return err
		}
		
		fmt.Printf("%7d | %s | %s\n", version, filename, appliedAt)
	}

	return rows.Err()
}