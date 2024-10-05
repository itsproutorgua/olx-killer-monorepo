package olxparser

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	models "olxparser/models"
	set "olxparser/set"
	"os"

	"github.com/tidwall/pretty"
)

func SaveToClone() {

	PrepareDir(fmt.Sprint(set.DataGetFolder))
	PrepareDir(fmt.Sprint(set.DataSendFolder))
	PrepareDir(fmt.Sprint(set.DataSendFolder, "/ok"))
	PrepareDir(fmt.Sprint(set.DataSendFolder, "/err"))

	files, err := os.ReadDir(set.DataGetFolder)
	if err != nil {
		fmt.Println("Error reading folder:", err)
		return
	}

	if len(files) == 0 {
		fmt.Println("No ads in folder:", set.DataGetFolder)
	} else {
		var n = 1
		for _, f := range files {

			var OlxId = f.Name()
			var dir string = fmt.Sprint(set.DataGetFolder, "/", OlxId)

			var json_file_name string = fmt.Sprint(dir, "/ad.json")

			json_file, err := os.Open(json_file_name)
			if err != nil {
				fmt.Println("Error opening file:", err)
				return
			}
			defer json_file.Close()

			// Reading file and get json OlxAd data
			var Ad models.OlxAd
			decoder := json.NewDecoder(json_file)
			if err := decoder.Decode(&Ad); err != nil {
				fmt.Println("Error decoding JSON:", err)
				return
			}

			// Create struct Product
			var product models.Product

			var PriceUAH float64 = 0.00
			var PriceUSD float64 = 0.00

			for _, OlxParam := range Ad.Params {
				if OlxParam.Key == "price" {
					if OlxParam.Value.Currency == "UAH" {
						PriceUAH = OlxParam.Value.Value
						PriceUSD = PriceUAH / set.CurrencyVal
					}

					if OlxParam.Value.Currency != "UAH" {
						PriceUAH = OlxParam.Value.ConvertedValue
						PriceUSD = OlxParam.Value.Value
					}
				}
			}

			PriceUAH = math.Round(PriceUAH*100) / 100
			PriceUSD = math.Round(PriceUSD*100) / 100

			// Read jsone phone file
			json_file_phones, err := os.Open(fmt.Sprint(dir, "/phones.json"))
			var phoneList []string
			if err == nil {

				var Phones models.OlxPhones
				decoder_phones := json.NewDecoder(json_file_phones)
				if err := decoder_phones.Decode(&Phones); err != nil {
					fmt.Println("Ошибка при декодировании JSON phones:", err)
					return
				}
				if len(Phones.Data.Phones) == 0 {
					// If phones is empty, just make phoneList equal an empty slice
					phoneList = []string{}
				} else {
					phoneList = append(phoneList, Phones.Data.Phones...)
				}
			} else {
				// If phones is empty, just make phoneList equal an empty slice
				phoneList = []string{}
			}
			defer json_file_phones.Close()

			img_files, err := os.ReadDir(fmt.Sprint(set.DataGetFolder, "/", OlxId, "/images/"))
			if err != nil {
				//fmt.Println("Error read dir:", err)
				return
			}

			var photoLinks []models.CloneImages
			for _, img_f := range img_files {
				if len(img_files) > 0 {
					link := ImageToBase64(fmt.Sprint(dir, "/images/", img_f.Name()))
					var linkData models.CloneImages
					linkData.Name = img_f.Name()
					linkData.Data = link
					photoLinks = append(photoLinks, linkData)
				}
			}

			product = models.Product{
				SecretKey:   "fake_product",
				ProdOlxId:   Ad.OlxId,
				CatIDOLX:    Ad.Category.OlxCatId,
				Title:       Ad.Title,
				PriceUAH:    PriceUAH,
				PriceUSD:    PriceUSD,
				Description: Ad.Description,
				Images:      photoLinks,
				Seller: models.SellerInfo{
					UserOlxId:    Ad.User.OlxUserId,
					Name:         Ad.User.Name,
					PhoneNumbers: phoneList,
				},
			}

			// Convert to JSON
			req_json_data, err := json.Marshal(product)
			req_json_data = pretty.Pretty(req_json_data)
			if err != nil {
				// Parse errors
			}

			// Create HTTP request
			url := set.OlxCloneApiUrl
			req, err := http.NewRequest("POST", url, bytes.NewBuffer(req_json_data))
			if err != nil {
				//fmt.Println("Error creating request:", err)
				return
			}
			req.Header.Set("Content-Type", "application/json")

			is_sended := ""

			// Send request
			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				//fmt.Println(" Error sending request:", err)
				// Save file with raw json
				PrepareDir(fmt.Sprint(set.DataSendFolder, "/err/", OlxId))
				os.WriteFile(fmt.Sprint(set.DataSendFolder, "/err/", OlxId, "/req.json"), req_json_data, 0644)
				is_sended = "Not ok"
				return
			}
			res_json_data, err := io.ReadAll(resp.Body)
			res_json_data = pretty.Pretty(res_json_data)

			defer resp.Body.Close()

			// Get Response
			if resp.StatusCode == http.StatusOK ||
				resp.StatusCode == http.StatusCreated {
				//fmt.Println("Request successful!")
				// Save file with raw json
				PrepareDir(fmt.Sprint(set.DataSendFolder, "/ok/", OlxId))
				os.WriteFile(fmt.Sprint(set.DataSendFolder, "/ok/", OlxId, "/req.json"), req_json_data, 0644)
				os.WriteFile(fmt.Sprint(set.DataSendFolder, "/ok/", OlxId, "/res.json"), res_json_data, 0644)
				is_sended = "Ok"

			} else {
				fmt.Println("Request failed with status code", err)
				// Save file with raw json
				PrepareDir(fmt.Sprint(set.DataSendFolder, "/err/", OlxId))
				os.WriteFile(fmt.Sprint(set.DataSendFolder, "/err/", OlxId, "/req.json"), req_json_data, 0644)
				os.WriteFile(fmt.Sprint(set.DataSendFolder, "/err/", OlxId, "/res.json"), res_json_data, 0644)
				is_sended = "Not ok"
			}

			fmt.Print("\033[1K\r ", n, ") OlxId: ", OlxId, ", State: ", is_sended)
			n++

		}
	}
}
