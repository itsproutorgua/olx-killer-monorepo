package models

type Product struct {
	SecretKey   string        `json:"secret_key"`
	ProdOlxId   int           `json:"prod_olx_id"`
	CatIDOLX    int           `json:"cat_id_olx"`
	Title       string        `json:"title"`
	PriceUAH    float64       `json:"price_uah"`
	PriceUSD    float64       `json:"price_usd"`
	Description string        `json:"description"`
	Images      []CloneImages `json:"images"`
	Seller      SellerInfo    `json:"seller"`
}

type SellerInfo struct {
	UserOlxId    int      `json:"user_olx_id"`
	Name         string   `json:"name"`
	PhoneNumbers []string `json:"phone_numbers"`
}

type CloneImages struct {
	Name string `json:"name"`
	Data string `json:"data"`
}
