package factory

import (
	"protein-web-backend/internal/service"
)

// Services holds all service instances
type Services struct {
	User service.UserService
	Review service.ReviewService
	// 新しいサービスを追加する場合はここに追加
	// Product service.ProductService
}

// NewServices creates and returns all service instances
func (f *Factory) NewServices(repos *Repositories) *Services {
	return &Services{
		User: service.NewUserService(repos.User),
		Review: service.NewReviewService(repos.Review, repos.User),
		// 新しいサービスの初期化を追加（リポジトリを注入）
		// Product: service.NewProductService(repos.Product),
	}
}