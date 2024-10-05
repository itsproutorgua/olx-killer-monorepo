package olxparser

import (
	"fmt"
	"io"
	"net/http"
	models "olxparser/models"
	set "olxparser/set"
	"os"
	"strconv"
	"strings"
)

func SaveImages(Photos []models.OlxPhoto, OlxId int) {
	for _, photo := range Photos {
		var filename = fmt.Sprint(set.DataGetFolder, "/", OlxId, "/images/", photo.Filename, ".webp")

		link := photo.Link
		link = strings.Replace(link, "{width}", strconv.Itoa(photo.Width), 1)
		link = strings.Replace(link, "{height}", strconv.Itoa(photo.Height), 1)

		response, err := http.Get(link)
		if err != nil {
			HandleMessage(fmt.Sprint("Load image error:", err))
			return
		}
		defer response.Body.Close()

		file, err := os.Create(filename) // Image filepath
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
}
