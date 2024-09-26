package olxparser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/tidwall/pretty"
)

type Response struct {
	Data []struct {
		Id              int    `json:"id"`
		Url             string `json:"url"`
		LastRefreshTime string `json:"last_refresh_time"`
		Status          string `json:"status"`
		IsProtectPhone  bool   `json:"protect_phone"`
		User            struct {
			Name   string `json:"name"`
			Status string `json:"status"`
		} `json:"user"`
		Photos []struct {
			Id       string `json:"id"`
			Filename string `json:"filename"`
			Width    int    `json:"width"`
			Height   int    `json:"height"`
			Link     string `json:"link"`
		} `json:"photos"`
		Contact struct {
			Name      string `json:"name"`
			IsPhone   bool   `json:"phone"`
			IsChat    bool   `json:"chat"`
			IsCourier bool   `json:"courier"`
		} `json:"contact"`
	} `json:"data"`
}

func ParsePage(i int) {
	var Url string = fmt.Sprint("https://www.olx.ua/api/v1/offers/?offset=", i)

	resp, err := http.Get(Url)
	if err != nil {
		HandleMessage("No response from request")
	}
	defer resp.Body.Close()

	json_data, err := io.ReadAll(resp.Body) // response body is []byte
	if err != nil {
		HandleMessage("Cant read response")
	}

	json_data = pretty.Pretty(json_data)

	var file_name string = fmt.Sprint("./data/olx", i, ".json")

	/*Save raw JSON for -=i=- page*/
	os.WriteFile(file_name, json_data, 0644)

	var result Response
	if err := json.Unmarshal(json_data, &result); err != nil { // Parse []byte to the go struct pointer
		HandleMessage("Can not unmarshal JSON")
	}

	/*Loop through the data*/
	for _, rec := range result.Data {

		PrepareDir(fmt.Sprint("./data/", rec.Id, "/"))

		PrepareDir(fmt.Sprint("./data/", rec.Id, "/images/"))

		ads_json, _ := json.Marshal(rec)
		ads_json = pretty.Pretty(ads_json)
		os.WriteFile(fmt.Sprint("./data/", rec.Id, "/adt.json"), ads_json, 0644)

		/*Saving images*/
		if len(rec.Photos) > 0 {
			for _, photo := range rec.Photos {
				var filename = fmt.Sprint("./data/", rec.Id, "/images/", photo.Filename, ".webp")
				link := strings.Replace(photo.Link, "{width}", strconv.Itoa(photo.Width), 1)
				link = strings.Replace(link, "{height}", strconv.Itoa(photo.Height), 1)

				SaveImages(link, filename)
			}
		}

		/*Saving Phones*/
		if rec.Contact.IsPhone {
			SavePhones(rec.Id, rec.IsProtectPhone)
		}

	}

}
