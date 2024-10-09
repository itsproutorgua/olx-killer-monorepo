package main

import (
	"bufio"
	olxparser "olxparser/func"
	"olxparser/set"
	"os"
	"strconv"
	"sync"
)

/*Parsing first N pages and starts the same number of parallel processes*/

func main() {

	for {
		olxparser.HandleMessage(
			"\n\n......................................\n\n",
			"use proxy to get: ", set.UseProxyToGet, "\n",
			"use proxy to send: ", set.UseProxyToSend, "\n",
			"use api to send: ", set.OlxCloneApiUrl, "\n",
			"\n\n......................................\n\n",
			"Select:\n",
			"0 to Exit\n",
			"1 to start parcing ", set.ParseOlxPagesQty, " OLX pages ( ~ ", set.ParseOlxPagesQty*set.OlxAdsOnPage, "ads )\n",
			"2 to start uploading to Clone\n",
		)
		scanner := bufio.NewScanner(os.Stdin)
		scanner.Scan()
		input, err := strconv.Atoi(scanner.Text())
		if err != nil {
			olxparser.HandleMessage("Error while converting string to int:", err)
			return
		}

		if input == 1 {
			var wg sync.WaitGroup

			for i := 0; i < set.ParseOlxPagesQty*set.OlxAdsOnPage; i += set.OlxAdsOnPage {
				wg.Add(1)
				go func(page int) {
					defer wg.Done()
					olxparser.HandleMessage("Run Ads from ", page, "-", page+1+set.OlxAdsOnPage, "\n")
					olxparser.ParsePage(page)
					olxparser.HandleMessage("Done Ads from ", page, "-", page+1+set.OlxAdsOnPage, "\n")
				}(i)
			}

			wg.Wait()
			olxparser.HandleMessage("\n--=Parsed Ads:", olxparser.ProcessedAds, "=--\n")
		}

		if input == 2 {
			olxparser.SaveToClone()
		}

		if input == 0 {
			return
		}
	}

}
