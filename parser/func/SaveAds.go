package olxparser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"olxparser/models"
	"olxparser/set"
	"os"

	"github.com/tidwall/pretty"
)

func SaveAds(i int, OlxCatID int) {
	var Url = ""
	if OlxCatID > 0 {
		Url = fmt.Sprint("https://www.olx.ua/api/v1/offers/?offset=", i, "&category_id=", OlxCatID)
	} else {
		Url = fmt.Sprint("https://www.olx.ua/api/v1/offers/?offset=", i)
	}
	PrepareDir(fmt.Sprint(set.DataGetRawFolder))

	req, _ := http.NewRequest("GET", Url, nil)
	resp, _ := InitHttpRequest(req, set.UseProxyToGet)

	defer resp.Body.Close()

	json_data, err := io.ReadAll(resp.Body) // response body is []byte
	if err != nil {
		HandleMessage("Cant read response")
	}
	json_data = pretty.Pretty(json_data)

	var file_name string = fmt.Sprint(set.DataGetRawFolder, "/ads_raw_", i, ".json")
	/*Save raw regions JSON */
	os.WriteFile(file_name, json_data, 0644)

	var result models.OlxAds
	if err := json.Unmarshal(json_data, &result); err != nil { // Parse []byte to the go struct pointer
		HandleMessage("Can not unmarshal JSON!")
	}

	var n = 1
	/*Loop through the data*/
	PrepareDir(fmt.Sprint(set.DataGetFolder))
	for _, OlxAd := range result.OlxData {

		PrepareDir(fmt.Sprint(set.DataGetFolder, "/", OlxAd.OlxId, "/"))

		PrepareDir(fmt.Sprint(set.DataGetFolder, "/", OlxAd.OlxId, "/images/"))

		ad_json, _ := json.Marshal(OlxAd)
		ad_json = pretty.Pretty(ad_json)
		os.WriteFile(fmt.Sprint(set.DataGetFolder, "/", OlxAd.OlxId, "/ad.json"), ad_json, 0644)

		/*Saving images*/
		if len(OlxAd.Photos) > 0 {
			SaveImages(OlxAd.Photos, OlxAd.OlxId)
		}

		/*Saving Phones*/
		// if OlxAd.Contact.IsPhone {
		// 	SavePhones(OlxAd.OlxId)
		// }

		HandleMessage("\033[1K\r ", ProcessedAds, " Ads done from ~", set.OlxAdsOnPage*set.ParseOlxPagesQty)
		n++
		ProcessedAds++
	}
}
