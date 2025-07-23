package factory

import (
	"database/sql"
)

// Factory manages the creation of all application dependencies
type Factory struct {
	DB *sql.DB
}

// New creates a new Factory instance
func New(db *sql.DB) *Factory {
	return &Factory{
		DB: db,
	}
}

// NewAppComponents creates all application components in the correct order
func (f *Factory) NewAppComponents() (*Repositories, *Services, *Handlers) {
	repos := f.NewRepositories()
	services := f.NewServices(repos)
	handlers := f.NewHandlers(services)
	
	return repos, services, handlers
}