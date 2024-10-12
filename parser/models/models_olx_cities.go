package models

type OlxCities struct {
	OlxCity []OlxCity `json:"data"`
}

type OlxCity struct {
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	RegionId     int     `json:"region_id"`
	County       string  `json:"county"`
	Municipality string  `json:"municipality"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}
