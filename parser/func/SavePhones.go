package olxparser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	models "olxparser/models"
	set "olxparser/set"
	"os"

	"github.com/tidwall/pretty"
	"golang.org/x/exp/rand"
)

func SavePhones(OlxId int) {

	var phonesURL = fmt.Sprint("https://www.olx.ua/api/v1/offers/", OlxId, "/limited-phones/")

	var phones_file = fmt.Sprint(set.DataGetFolder, "/", OlxId, "/phones.json")

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
	req, err := http.NewRequest("GET", phonesURL, nil)
	if err != nil {
		HandleMessage("Error in building proxy query:", err)
		return
	}

	req.Header.Add("Authorization", set.OlxApiKey)

	/*Run GET query*/
	resp, err := client.Do(req)
	if err != nil {
		HandleMessage("Running Get query error:", err)
		return
	}
	defer resp.Body.Close()
	json_data_phone, err := io.ReadAll(resp.Body) // response body is []byte
	if err != nil {
		HandleMessage("Cant read phones response", err)
	}

	json_data_phone = pretty.Pretty(json_data_phone)

	var result_phones models.OlxPhones
	if err := json.Unmarshal([]byte(json_data_phone), &result_phones); err != nil { // Parse []byte to the go struct pointer
		HandleMessage("Can not read phones JSON", err)
	}

	if len(result_phones.Data.Phones) > 0 {
		os.WriteFile(phones_file, json_data_phone, 0644)

		HandleMessage(OlxId, " Phones qty: ", len(result_phones.Data.Phones))

		// for _, Phone := range result_phones.Data.Phones {
		/*Print phone number*/
		//HandleMessage("Phone: ", Phone)
		// }

	}
	return

	//HandleMessage("Phone file already exists.")
}
