package olxparser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"olxparser/models"
	set "olxparser/set"
	"os"

	"github.com/tidwall/pretty"
	"golang.org/x/exp/rand"
)

func SaveCities() {
	var dir = fmt.Sprint(set.DataGetCitiesFolder)
	PrepareDir(dir)

	var CitiesPageQty = 30
	var CitiesOnOnePage = 1000

	var CitiesAll []models.OlxCity

	for i := 0; i < CitiesPageQty*CitiesOnOnePage; i += CitiesOnOnePage {
		var Url = fmt.Sprint("https://www.olx.ua/api/partner/cities?offset=", i)

		req, err := http.NewRequest("GET", Url, nil)
		if err != nil {
			HandleMessage("Error in building proxy query:", err)
			//return
		}
		/*If file did not exist, create it*/
		var client *http.Client
		if set.UseProxyToGet {
			proxyList := ProxyURLs(set.ProxyURLs)
			URL := proxyList[rand.Intn(len(proxyList)-1)]

			//HandleMessage("\033[1K\r Current proxy:", URL, "\n")

			proxyURL, _ := url.Parse(URL)
			proxy := http.ProxyURL(proxyURL)
			transport := &http.Transport{Proxy: proxy}
			client = &http.Client{Transport: transport}
		} else {
			client = &http.Client{}
		}

		req.Header.Add("Authorization", set.OlxApiKey)
		req.Header.Add("Version", "v2.0")

		/*Run GET query*/
		resp, err := client.Do(req)
		if err != nil {
			HandleMessage("Running Get query error:", err)
			//return
		}
		defer resp.Body.Close()
		json_data, err := io.ReadAll(resp.Body) // response body is []byte
		if err != nil {
			HandleMessage("Can't read cities response", err)
		}

		/*Write raw response to json file*/
		json_data = pretty.Pretty(json_data)
		var file_name_raw = fmt.Sprint(dir, "/cities_", i, "_raw.json")
		os.WriteFile(file_name_raw, json_data, 0644)

		var result models.OlxCities
		if err := json.Unmarshal([]byte(json_data), &result); err != nil { // Parse []byte to the go struct pointer
			//HandleMessage("Can't read cities JSON", err)
		}
		//HandleMessage("Cities qty: ", len(result.OlxCity), "\n")

		if len(result.OlxCity) > 0 {
			CitiesAll = append(CitiesAll, result.OlxCity...)

			var file_name = fmt.Sprint(set.DataGetCitiesFolder, "/cities_", i, ".json")

			/*Write Formatted response to json file*/
			result_json, _ := json.Marshal(result)
			result_json = pretty.Pretty(result_json)
			os.WriteFile(file_name, result_json, 0644)

		}
		HandleMessage("\033[1K\r ", "Cities page ", i, "  qty: ", len(result.OlxCity))
	}

	var file_name_all = fmt.Sprint(set.DataGetCitiesFolder, "/cities_all.json")
	/*Write Formatted response to json file*/
	result_json, _ := json.Marshal(CitiesAll)
	result_json = pretty.Pretty(result_json)
	os.WriteFile(file_name_all, result_json, 0644)

	return

}
