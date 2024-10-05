package models

type Settings struct {
	Token            string  `json:"token"`
	ApiUrl           string  `json:"apiurl"`
	ProxyList        string  `json:"proxy_list"`
	CurrencyVal      float64 `json:"currency_val"`
	DataSendFolder   string  `json:"data_send_folder"`
	DataGetFolder    string  `json:"data_get_folder"`
	DSN              string  `json:"dsn"`
	ParseOlxPagesQty int     `json:"parse_olx_pages_qty"`
}
