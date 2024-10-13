package olxparser

import (
	"math/rand"
	"net/http"
	"net/url"
	"olxparser/set"
)

func InitHttpRequest(req *http.Request, UseProxy bool) (*http.Response, error) {
	var client *http.Client

	req.Header.Set("Content-Type", "application/json")

	// Send request
	if UseProxy {

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
	resp, err := client.Do(req)
	return resp, err
}
