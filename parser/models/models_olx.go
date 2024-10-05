package models

type OlxAds struct {
	OlxData []struct {
		OlxId           int         `json:"id"`
		Title           string      `json:"title"`
		Description     string      `json:"description"`
		Url             string      `json:"url"`
		LastRefreshTime string      `json:"last_refresh_time"`
		Status          string      `json:"status"`
		IsProtectPhone  bool        `json:"protect_phone"`
		Category        OlxCategory `json:"category"`
		User            OlxUser     `json:"user"`
		Params          []OlxParam  `json:"params"`
		Photos          []OlxPhoto  `json:"photos"`
		Contact         OlxContact  `json:"contact"`
	} `json:"data"`
}

type OlxAd struct {
	OlxId           int         `json:"id"`
	Title           string      `json:"title"`
	Description     string      `json:"description"`
	Url             string      `json:"url"`
	LastRefreshTime string      `json:"last_refresh_time"`
	Status          string      `json:"status"`
	IsProtectPhone  bool        `json:"protect_phone"`
	User            OlxUser     `json:"user"`
	Category        OlxCategory `json:"category"`
	Params          []OlxParam  `json:"params"`
	Photos          []OlxPhoto  `json:"photos"`
	Contact         OlxContact  `json:"contact"`
}

type OlxPhones struct {
	Data struct {
		Phones []string `json:"phones"`
	} `json:"data"`
}

type OlxParam struct {
	Key   string `json:"key"`
	Name  string `json:"name"`
	Value struct {
		Value          float64 `json:"value"`
		Type           string  `json:"type"`
		Currency       string  `json:"currency"`
		ConvertedValue float64 `json:"converted_value"`
	} `json:"value"`
}

type OlxUser struct {
	OlxUserId int    `json:"id"`
	Name      string `json:"name"`
}

type OlxCategory struct {
	OlxCatId int    `json:"id"`
	Type     string `json:"type"`
	Name     string `json:"name"`
}

type OlxPhoto struct {
	OlxPhotoId int    `json:"id"`
	Filename   string `json:"filename"`
	Width      int    `json:"width"`
	Height     int    `json:"height"`
	Link       string `json:"link"`
}

type OlxContact struct {
	Name      string `json:"name"`
	IsPhone   bool   `json:"phone"`
	IsChat    bool   `json:"chat"`
	IsCourier bool   `json:"courier"`
}
