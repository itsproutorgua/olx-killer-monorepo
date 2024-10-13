package olxparser

import (
	set "olxparser/set"
	"strconv"
	"strings"
	"sync"
)

func SavePages() {
	HandleMessage("\033[1K\r\033[1K\r")

	done := make(chan struct{}) // Channel to signal completion of all goroutines

	OlxCategoriesArray := strings.Split(set.GetCertainCategories, ",")

	var wg sync.WaitGroup

	for _, c := range OlxCategoriesArray {
		c, err := strconv.Atoi(c)
		if err != nil {
			HandleMessage("Olx category id error\n", err)
			return
		}
		for i := 0; i < set.ParseOlxPagesQty*set.OlxAdsOnPage; i += set.OlxAdsOnPage {
			wg.Add(1)
			go func(page int) {
				defer wg.Done()
				SaveAds(page, c)
				done <- struct{}{} // Sending a signal about the completion of the goroutine
			}(i)
		}
	}

	go func() {
		wg.Wait()   // Waiting for all goroutines to complete
		close(done) // Close the channel after all goroutines are completed
	}()
	<-done // We wait until all goroutines are finished

	HandleMessage("\u001B[1K\n--=Get Ads ", ProcessedAds, "=--\n")
}
