package migration

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

// Migration represents a database migration
type Migration struct {
	Version  int
	Filename string
	UpSQL    string
	DownSQL  string
}

// Runner handles database migration operations
type Runner struct {
	db            *sql.DB
	migrationsDir string
}

// NewRunner creates a new migration runner
func NewRunner(db *sql.DB, migrationsDir string) *Runner {
	return &Runner{
		db:            db,
		migrationsDir: migrationsDir,
	}
}

// Run executes all pending migrations
func (r *Runner) Run() error {
	// Ensure migration_history table exists
	if err := r.createMigrationHistoryTable(); err != nil {
		return fmt.Errorf("failed to create migration_history table: %w", err)
	}

	// Get all migration files
	migrations, err := r.loadMigrations()
	if err != nil {
		return fmt.Errorf("failed to load migrations: %w", err)
	}

	// Get applied migrations
	appliedVersions, err := r.getAppliedMigrations()
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	// Apply pending migrations
	for _, migration := range migrations {
		if _, applied := appliedVersions[migration.Version]; !applied {
			if err := r.applyMigration(migration); err != nil {
				return fmt.Errorf("failed to apply migration %d: %w", migration.Version, err)
			}
			log.Printf("Applied migration %d: %s", migration.Version, migration.Filename)
		}
	}

	log.Println("All migrations completed successfully")
	return nil
}

// createMigrationHistoryTable creates the migration_history table if it doesn't exist
func (r *Runner) createMigrationHistoryTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS migration_history (
		version INT PRIMARY KEY,
		filename VARCHAR(255) NOT NULL,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	
	_, err := r.db.Exec(query)
	return err
}

// loadMigrations loads all migration files from the migrations directory
func (r *Runner) loadMigrations() ([]Migration, error) {
	files, err := ioutil.ReadDir(r.migrationsDir)
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
		content, err := ioutil.ReadFile(filepath.Join(r.migrationsDir, filename))
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

// getAppliedMigrations returns a map of applied migration versions
func (r *Runner) getAppliedMigrations() (map[int]bool, error) {
	query := "SELECT version FROM migration_history"
	rows, err := r.db.Query(query)
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

// applyMigration applies a single migration
func (r *Runner) applyMigration(migration Migration) error {
	// Start transaction
	tx, err := r.db.Begin()
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

// Rollback rolls back the last migration
func (r *Runner) Rollback() error {
	// Get the last applied migration
	query := "SELECT version, filename FROM migration_history ORDER BY version DESC LIMIT 1"
	var version int
	var filename string
	
	err := r.db.QueryRow(query).Scan(&version, &filename)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("no migrations to rollback")
		}
		return err
	}

	// Load the down migration
	migrations, err := r.loadMigrations()
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
	tx, err := r.db.Begin()
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