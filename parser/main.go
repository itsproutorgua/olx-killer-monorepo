package main

import (
	"fmt"
	olxparser "olxparser/func"
	"sync"
)

/*Parsing first N pages and starts the same number of parallel processes*/
var parsePages int = 5

func main() {
	var wg sync.WaitGroup

	for i := 0; i <= parsePages*40; i += 40 {
		wg.Add(1)
		go func(page int) {
			defer wg.Done()
			olxparser.HandleMessage(fmt.Sprintf("Run ads %d", page))
			olxparser.ParsePage(page)
			olxparser.HandleMessage(fmt.Sprintf("Done ads %d", page))
		}(i)
	}

	wg.Wait()
}
