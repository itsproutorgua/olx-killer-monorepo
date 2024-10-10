package main

import (
	"bufio"
	olxparser "olxparser/func"
	"olxparser/set"
	"os"
	"strconv"
	"strings"
	"sync"
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
		olxparser.HandleMessage(
			"\nSelect:\n",
			"1 to start parsing ", set.ParseOlxPagesQty, " OLX pages ( ~ ", set.ParseOlxPagesQty*set.OlxAdsOnPage, "ads )\n",
			"2 to start uploading to Clone\n",
			"Or other key to Exit\n",
			//"3 to start parsing Cities from OLX\n",
			//"4 to start parsing Regions from OLX\n",
		)
		scanner := bufio.NewScanner(os.Stdin)
		scanner.Scan()

		input, err := strconv.Atoi(scanner.Text())
		if err != nil && input != 1 && input != 2 {
			olxparser.HandleMessage("\nExit")
			return
		}

		if input == 1 {
			olxparser.HandleMessage("\033[1K\r\033[1K\r")

			done := make(chan struct{}) // Канал для сигнала о завершении всех горутин

			var start_time = time.Now()

			olx_cat_array := strings.Split(set.GetCertainCategories, ",") // Разделяем строку по запятым

			var wg sync.WaitGroup

			for _, c := range olx_cat_array {
				c, err := strconv.Atoi(c)
				if err != nil {
					olxparser.HandleMessage("Olx category id error\n", err)
					return
				}
				for i := 0; i < set.ParseOlxPagesQty*set.OlxAdsOnPage; i += set.OlxAdsOnPage {
					wg.Add(1)
					go func(page int) {
						defer wg.Done()
						olxparser.HandleMessage("\nRun Ads from ", page, " cat id ", c, "\n")
						olxparser.ParsePage(page, c)
						olxparser.HandleMessage("\nDone Ads from ", page, " cat id ", c, "\n")
						done <- struct{}{} // Отправляем сигнал о завершении горутины
					}(i)
				}
			}

			//wg.Wait()

			go func() {
				wg.Wait()   // Ждем завершения всех горутин
				close(done) // Закрываем канал после завершения всех горутин
			}()
			<-done // Ждем, пока все горутины завершатся

			olxparser.HandleMessage("\n--=Parsed Ads:", olxparser.ProcessedAds, "=--\n")
			timeTrack(start_time, "Get Ads") // Теперь вызываем timeTrack
		}

		if input == 2 {
			var start_time = time.Now()
			olxparser.SaveToClone()
			timeTrack(start_time, "Send Ads") // Теперь вызываем timeTrack
		}

	}

}
