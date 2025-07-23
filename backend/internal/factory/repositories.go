package factory

import (
	"protein-web-backend/internal/repository"
)

// Repositories holds all repository instances
type Repositories struct {
	User repository.UserRepository
	// 新しいリポジトリを追加する場合はここに追加
	// Product repository.ProductRepository
	// Review  repository.ReviewRepository
}

// NewRepositories creates and returns all repository instances
func (f *Factory) NewRepositories() *Repositories {
	return &Repositories{
		User: repository.NewUserRepository(f.DB),
		// 新しいリポジトリの初期化を追加
		// Product: repository.NewProductRepository(f.DB),
		// Review:  repository.NewReviewRepository(f.DB),
	}
}