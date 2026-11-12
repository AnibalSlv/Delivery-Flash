package backend

import "flash/backend/services"

type BackendManager struct {
	Product *services.ProductService
}

func NewBackendManager() *BackendManager {
	return &BackendManager{
		Product: services.NewProductService(),
	}
}
