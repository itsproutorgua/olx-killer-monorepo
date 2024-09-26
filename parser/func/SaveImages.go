package olxparser

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func SaveImages(imageURL string, fileName string) {

	response, err := http.Get(imageURL)
	if err != nil {
		HandleMessage(fmt.Sprint("Load image error:", err))
		return
	}
	defer response.Body.Close()

	file, err := os.Create(fileName) // Image filepath
	if err != nil {
		HandleMessage(fmt.Sprint("Create file error:", err))
		return
	}
	defer file.Close()

	_, err = io.Copy(file, response.Body)
	if err != nil {
		HandleMessage(fmt.Sprint("Save image error:", err))
		return
	}
}
