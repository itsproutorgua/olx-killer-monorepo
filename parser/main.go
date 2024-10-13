package main

import (
	"bufio"
	olxparser "olxparser/func"
	"olxparser/set"
	"os"
	"strconv"
	"time"
)

func timeTrack(start time.Time, name string) {
	elapsed := time.Since(start).Round(time.Second)
	olxparser.HandleMessage("\n", name, " took ", elapsed, "\n")
}

/*Parsing first N pages and starts the same number of parallel processes*/

func main() {
	olxparser.HandleMessage(
		"\n............Settings..................\n",
		"proxy to get: ", set.UseProxyToGet, "\n",
		"proxy to send: ", set.UseProxyToSend, "\n",
		"api to send: ", set.OlxCloneApiUrl, "\n",
		"olx cat IDs to get: ", set.GetCertainCategories, "\n",
		"......................................",
	)

	for {
		AdsFiles, _ := os.ReadDir(set.DataGetFolder)

		olxparser.HandleMessage(
			"\nSelect:\n",
			"1 to start parsing ", set.ParseOlxPagesQty, " OLX pages ( ~ ", set.ParseOlxPagesQty*set.OlxAdsOnPage, "ads )\n",
			"2 to start uploading to Clone ", len(AdsFiles), " ads\n",
			"3 to start parsing Regions from OLX\n",
			"4 to start parsing Cities from OLX\n",
			"Or other key to Exit\n",
		)
		scanner := bufio.NewScanner(os.Stdin)
		scanner.Scan()

		input, _ := strconv.Atoi(scanner.Text())

		if input == 1 {
			var StartTime = time.Now()
			olxparser.SavePages()
			timeTrack(StartTime, "Get Ads")
		} else if input == 2 {
			var StartTime = time.Now()
			olxparser.SaveToClone()
			timeTrack(StartTime, "Send Ads")
		} else if input == 3 {
			var StartTime = time.Now()
			olxparser.SaveRegions()
			timeTrack(StartTime, "Get Regions")
		} else if input == 4 {
			var StartTime = time.Now()
			olxparser.SaveCities()
			timeTrack(StartTime, "Get Cities")
		} else {
			olxparser.HandleMessage("\nExit")
			return
		}

	}

}
