package olxparser

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	models "olxparser/models"
	set "olxparser/set"
	"os"

	"github.com/tidwall/pretty"
)

func SavePhones(OlxId int) {

	var Url = fmt.Sprint("https://www.olx.ua/api/v1/offers/", OlxId, "/limited-phones/")
	req, _ := http.NewRequest("GET", Url, nil)
	req.Header.Add("Authorization", set.OlxApiKey)

	resp, _ := InitHttpRequest(req, set.UseProxyToGet)

	defer resp.Body.Close()

	json_data, err := io.ReadAll(resp.Body) // response body is []byte
	if err != nil {
		HandleMessage("Cant read phones response", err)
	}

	json_data = pretty.Pretty(json_data)

	var result models.OlxPhones
	if err := json.Unmarshal([]byte(json_data), &result); err != nil { // Parse []byte to the go struct pointer
		HandleMessage("Can not read phones JSON", err)
	}
	var file = fmt.Sprint(set.DataGetFolder, "/", OlxId, "/phones.json")
	if len(result.Data.Phones) > 0 {
		os.WriteFile(file, json_data, 0644)

		HandleMessage(OlxId, " Phones qty: ", len(result.Data.Phones))

		// for _, Phone := range result.Data.Phones {
		/*Print phone number*/
		//HandleMessage("Phone: ", Phone)
		// }

	}
	return
}
