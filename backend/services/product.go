package services

type ProductService struct {
	// db *database.MemoryDB
}

func NewProductService() *ProductService {
	return &ProductService{
		// db: db,
	}
}

type TopProduct struct {
	Name  string
	Price float32
}

func (p *ProductService) GetProductTop() []TopProduct {
	return []TopProduct{{Name: "Coca-Cola", Price: 0}, {Name: "sad", Price: 1}}
}
