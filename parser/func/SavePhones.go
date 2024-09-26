package olxparser

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/tidwall/pretty"
	"golang.org/x/exp/rand"
)

type ResponsePhones struct {
	Data struct {
		Phones []string `json:"phones"`
	} `json:"data"`
}

var apiKey = "Bearer eyJraWQiOiI3TzI5clpiaDVHXC9SR3NTZ2g2ZzZRN1QrMVJZdTdsWFwvXC9qd3dyWnozVjNzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NzYwMGY4Yi00ZWJjLTQ2ZDktOGExNi1iMmI1ODhhODBjMmUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9WMkFKVVgwWEUiLCJjbGllbnRfaWQiOiIzMDlsc2doMGRlaXJsbzJsYTlrbXJtaGUzdiIsIm9yaWdpbl9qdGkiOiJiZTY1MDE0YS1mNjA2LTQ0MWQtODc4MS03ZWVlZmYxZTJlZDQiLCJldmVudF9pZCI6ImVhOTA1MzBkLTQ0MjItNDM2NC05MTJiLTMwNmEwYzVlN2Y2MiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjcyOTc2MjQsImV4cCI6MTcyNzI5ODUyNCwiaWF0IjoxNzI3Mjk3NjI0LCJqdGkiOiJhNWY5MGYyMC1iZTIyLTQ3NGMtOWQ1Yy00M2VkM2RiYmVlNDUiLCJ1c2VybmFtZSI6IjVhMTk0ZGE0LTZiNzktNDZmMC04NjhmLTg0MDQ1NDEzNDVmMCJ9.XzybNxc6cZxFvQWf2jML-_WDef0bk14mBBe5NNXAVBmfQZ01zuAmN4nOe6-CurBg41nImuRlRAPJH9lYpjlbkx2XGy2DvCMpC9jNl8GoqFRq4EougUVC059nzmUvqRpq2COlfapKx5fedkJPkVgOASJEfVOnBTxiNt0yZoMXJX9UXh0xFCJ3pCmNPE8uB2gW1aJvoxHQ_aCIQO33B7HiLQzHpU2i26K2ToCnQ6PDDG7B8NHqVPx-UuDyQo-NFZdoeyh0neTICulfL3XhslbHgYtyPY4QYAJBAw6Kz68ql-hP7C45SJXX0i5-uunq4vhD9R0rcmfRgy_IBs-5erOW9A"

var proxyURLs = "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/refs/heads/master/http.txt"

func SavePhones(adsId int, isProtectPhone bool) {

	var phonesURL string = fmt.Sprint("https://www.olx.ua/api/v1/offers/", adsId, "/phones/")
	if isProtectPhone {
		phonesURL = fmt.Sprint("https://www.olx.ua/api/v1/offers/", adsId, "/limited-phones/")
	}

	var phones_file = fmt.Sprint("./data/", adsId, "/phones.json")
	/*If file did not exist, create it*/
	if _, err := os.Stat(phones_file); errors.Is(err, os.ErrNotExist) {
		//client := &http.Client{}
		proxyList := ProxyURLs(proxyURLs)
		URL := proxyList[rand.Intn(len(proxyList)-1)] //url.Parse("185.95.186.152:60606")

		HandleMessage(fmt.Sprint("Curren proxy:", URL))

		proxyURL, _ := url.Parse(URL)
		proxy := http.ProxyURL(proxyURL)
		transport := &http.Transport{Proxy: proxy}
		client := &http.Client{Transport: transport}

		req, err := http.NewRequest("GET", phonesURL, nil)
		if err != nil {
			HandleMessage(fmt.Sprint("Error in building query:", err))
			return
		}

		if isProtectPhone {
			req.Header.Add("Authorization", apiKey)
		}

		/*Run GET query*/
		//fmt.Println("Run GET query", phonesURL)
		resp2, err := client.Do(req)
		if err != nil {
			HandleMessage(fmt.Sprint("Running Get query error:", err))
			return
		}
		defer resp2.Body.Close()

		json_data_phone, err := io.ReadAll(resp2.Body) // response body is []byte
		if err != nil {
			HandleMessage(fmt.Sprint("Cant read response", err))
		}

		json_data_phone = pretty.Pretty(json_data_phone)

		var result_phones ResponsePhones
		if err := json.Unmarshal([]byte(json_data_phone), &result_phones); err != nil { // Parse []byte to the go struct pointer
			HandleMessage(fmt.Sprint("Can not unmarshal JSON", err))
		}
		//fmt.Println("result_phones:", result_phones)

		//os.WriteFile(phones_file, json_data_phone, 0644)
		if len(result_phones.Data.Phones) > 0 {
			os.WriteFile(phones_file, json_data_phone, 0644)

			HandleMessage(fmt.Sprint("Phones qty: ", len(result_phones.Data.Phones)))

			for _, phone := range result_phones.Data.Phones {
				/*Print phone number*/
				HandleMessage(fmt.Sprint("Phone: ", phone))
			}
		}
		return
	}

	HandleMessage("Phone file already exists.")
}
