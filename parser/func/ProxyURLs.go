package olxparser

import (
	"bufio"
	"fmt"
	"net/http"
)

func ProxyURLs(proxyURL string) []string {
	var proxyList []string

	response, err := http.Get(proxyURL)
	if err != nil {
		HandleMessage(fmt.Sprint("Data receive error:", err))
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
		HandleMessage(fmt.Sprint("Ошибка при чтении данных:", err))
	}
	return proxyList
}
