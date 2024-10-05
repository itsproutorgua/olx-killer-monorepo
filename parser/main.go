package main

import (
	"bufio"
	"fmt"
	olxparser "olxparser/func"
	"olxparser/set"
	"os"
	"strconv"
	"sync"
)

/*Parsing first N pages and starts the same number of parallel processes*/

func main() {

	fmt.Print("Select:\n1 to start parcing ", set.ParseOlxPagesQty, " OLX pages ( ~ ", set.ParseOlxPagesQty*50, "ads )\n2 to start uploading to Clone\n")
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	input, err := strconv.Atoi(scanner.Text())
	if err != nil {
		olxparser.HandleMessage(fmt.Sprint("Error while converting string to int:", err))
		return
	}

	if input == 1 {
		var wg sync.WaitGroup

		for i := 0; i < set.ParseOlxPagesQty*50; i += 50 {
			wg.Add(1)
			go func(page int) {
				defer wg.Done()
				olxparser.HandleMessage(fmt.Sprintf("Run Ads from %d-%d", page+1, page+1+set.ParseOlxPagesQty))
				olxparser.ParsePage(page)
				olxparser.HandleMessage(fmt.Sprintf("Done Ads from %d-%d", page+1, page+1+set.ParseOlxPagesQty))
			}(i)
		}

		wg.Wait()
	}

	if input == 2 {
		olxparser.SaveToClone()
		return
	}

}
