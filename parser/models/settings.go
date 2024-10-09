package models

type Settings struct {
	Token            string  `json:"token"`
	ApiUrl           string  `json:"apiurl"`
	ProxyList        string  `json:"proxy_list"`
	CurrencyVal      float64 `json:"currency_val"`
	DataSendFolder   string  `json:"data_send_folder"`
	DataGetFolder    string  `json:"data_get_folder"`
	DSN              string  `json:"dsn"`
	DB_TYPE          string  `json:"db_type"`
	ParseOlxPagesQty int     `json:"parse_olx_pages_qty"`
	OlxAdsOnPage     int     `json:"olx_ads_on_page"`
	UseProxyToSend   bool    `json:"use_proxy_to_send"`
	UseProxyToGet    bool    `json:"use_proxy_to_get"`
}
