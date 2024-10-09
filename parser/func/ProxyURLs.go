package olxparser

import (
	"bufio"
	"net/http"
)

func ProxyURLs(proxyURL string) []string {
	var proxyList []string

	response, err := http.Get(proxyURL)
	if err != nil {
		HandleMessage("Data receive error:", err)
		//return
	}
	defer response.Body.Close()

	scanner := bufio.NewScanner(response.Body)
	for scanner.Scan() {
		proxyServer := scanner.Text()

		/*Save url to Array*/
		proxyList = append(proxyList, proxyServer)
	}

	if err := scanner.Err(); err != nil {
		HandleMessage("Read data error:", err)
	}
	return proxyList
}
