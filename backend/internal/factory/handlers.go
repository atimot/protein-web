package factory

import (
	"protein-web-backend/internal/handler"
)

// Handlers holds all handler instances
type Handlers struct {
	User *handler.UserHandler
	// 新しいハンドラーを追加する場合はここに追加
	// Product *handler.ProductHandler
	// Review  *handler.ReviewHandler
}

// NewHandlers creates and returns all handler instances
func (f *Factory) NewHandlers(services *Services) *Handlers {
	return &Handlers{
		User: handler.NewUserHandler(services.User),
		// 新しいハンドラーの初期化を追加（サービスを注入）
		// Product: handler.NewProductHandler(services.Product),
		// Review:  handler.NewReviewHandler(services.Review),
	}
}