package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

// Migration represents a database migration
type Migration struct {
	Version  int
	Filename string
	UpSQL    string
	DownSQL  string
}

func main() {
	var (
		action  = flag.String("action", "up", "Migration action: up, down, status")
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

	// Migration operations
	migrationsDir := filepath.Join(".", "migrations")

	switch *action {
	case "up":
		if err := runMigrations(db, migrationsDir); err != nil {
			log.Fatal("Migration up failed:", err)
		}
		fmt.Println("Migrations completed successfully")

	case "down":
		if err := rollbackMigration(db, migrationsDir); err != nil {
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

func runMigrations(db *sql.DB, migrationsDir string) error {
	// Ensure migration_history table exists
	if err := createMigrationHistoryTable(db); err != nil {
		return fmt.Errorf("failed to create migration_history table: %w", err)
	}

	// Get all migration files
	migrations, err := loadMigrations(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to load migrations: %w", err)
	}

	// Get applied migrations
	appliedVersions, err := getAppliedMigrations(db)
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	// Apply pending migrations
	for _, migration := range migrations {
		if _, applied := appliedVersions[migration.Version]; !applied {
			if err := applyMigration(db, migration); err != nil {
				return fmt.Errorf("failed to apply migration %d: %w", migration.Version, err)
			}
			log.Printf("Applied migration %d: %s", migration.Version, migration.Filename)
		}
	}

	return nil
}

func rollbackMigration(db *sql.DB, migrationsDir string) error {
	// Get the last applied migration
	query := "SELECT version, filename FROM migration_history ORDER BY version DESC LIMIT 1"
	var version int
	var filename string

	err := db.QueryRow(query).Scan(&version, &filename)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("no migrations to rollback")
		}
		return err
	}

	// Load the down migration
	migrations, err := loadMigrations(migrationsDir)
	if err != nil {
		return err
	}

	var targetMigration *Migration
	for _, migration := range migrations {
		if migration.Version == version {
			targetMigration = &migration
			break
		}
	}

	if targetMigration == nil || targetMigration.DownSQL == "" {
		return fmt.Errorf("down migration not found for version %d", version)
	}

	// Start transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Execute down migration
	if _, err := tx.Exec(targetMigration.DownSQL); err != nil {
		return fmt.Errorf("failed to execute down migration: %w", err)
	}

	// Remove from migration history
	if _, err := tx.Exec("DELETE FROM migration_history WHERE version = ?", version); err != nil {
		return fmt.Errorf("failed to remove migration from history: %w", err)
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	log.Printf("Rolled back migration %d: %s", version, filename)
	return nil
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

func createMigrationHistoryTable(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS migration_history (
		version INT PRIMARY KEY,
		filename VARCHAR(255) NOT NULL,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`

	_, err := db.Exec(query)
	return err
}

func loadMigrations(migrationsDir string) ([]Migration, error) {
	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		return nil, err
	}

	migrationMap := make(map[int]*Migration)

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filename := file.Name()
		if !strings.HasSuffix(filename, ".sql") {
			continue
		}

		// Parse filename format: 001_create_users_table.up.sql
		parts := strings.Split(filename, "_")
		if len(parts) < 2 {
			continue
		}

		version, err := strconv.Atoi(parts[0])
		if err != nil {
			continue
		}

		// Read file content
		content, err := os.ReadFile(filepath.Join(migrationsDir, filename))
		if err != nil {
			return nil, err
		}

		// Initialize migration if not exists
		if migrationMap[version] == nil {
			migrationMap[version] = &Migration{
				Version: version,
			}
		}

		migration := migrationMap[version]

		// Determine if it's up or down migration
		if strings.Contains(filename, ".up.sql") {
			migration.UpSQL = string(content)
			migration.Filename = filename
		} else if strings.Contains(filename, ".down.sql") {
			migration.DownSQL = string(content)
		}
	}

	// Convert map to sorted slice
	var migrations []Migration
	for _, migration := range migrationMap {
		if migration.UpSQL != "" { // Only include migrations with up SQL
			migrations = append(migrations, *migration)
		}
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

func getAppliedMigrations(db *sql.DB) (map[int]bool, error) {
	query := "SELECT version FROM migration_history"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applied := make(map[int]bool)
	for rows.Next() {
		var version int
		if err := rows.Scan(&version); err != nil {
			return nil, err
		}
		applied[version] = true
	}

	return applied, rows.Err()
}

func applyMigration(db *sql.DB, migration Migration) error {
	// Start transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Execute migration SQL
	if _, err := tx.Exec(migration.UpSQL); err != nil {
		return fmt.Errorf("failed to execute migration SQL: %w", err)
	}

	// Record migration in history
	query := "INSERT INTO migration_history (version, filename) VALUES (?, ?)"
	if _, err := tx.Exec(query, migration.Version, migration.Filename); err != nil {
		return fmt.Errorf("failed to record migration history: %w", err)
	}

	// Commit transaction
	return tx.Commit()
}
