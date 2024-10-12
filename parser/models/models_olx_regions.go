package models

type OlxRegions struct {
	OlxRegion []struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	} `json:"data"`
}
