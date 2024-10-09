package set

import (
	"encoding/json"
	"fmt"
	"olxparser/models"
	"os"
)

func getSettings(json_file_name string) models.Settings {

	json_file, err := os.Open(json_file_name)
	if err != nil {
		fmt.Println("Error while opening settings file:", err)
	}
	defer json_file.Close()

	// Reading file and get json data
	var settings models.Settings
	decoder := json.NewDecoder(json_file)
	if err := decoder.Decode(&settings); err != nil {
		fmt.Print("Decode error on settings:", err)
		return settings
	}

	return settings

}

var settings = getSettings("./env.json")

var OlxCloneApiUrl = settings.ApiUrl

var DataSendFolder = settings.DataSendFolder

var DataGetFolder = settings.DataGetFolder

var OlxApiKey = settings.Token

var ProxyURLs = settings.ProxyList

var CurrencyVal = settings.CurrencyVal

var DSN = settings.DSN

var DB_TYPE = settings.DB_TYPE

var ParseOlxPagesQty = settings.ParseOlxPagesQty

var OlxAdsOnPage = settings.OlxAdsOnPage

var UseProxyToSend = settings.UseProxyToSend

var UseProxyToGet = settings.UseProxyToGet
