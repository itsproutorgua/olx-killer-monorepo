package olxparser

import (
	"encoding/base64"
	"io/ioutil"
	"log"
	"net/http"
)

func toBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func ImageToBase64(filename string) string {
	// Прочитаем файл изображения в виде среза байтов
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatal(err)
	}

	var base64Encoding string

	// Определим MIME-тип изображения
	mimeType := http.DetectContentType(bytes)

	// Добавим соответствующий заголовок URI-схемы в зависимости от MIME-типа
	switch mimeType {
	case "image/jpeg":
		base64Encoding += "data:image/jpeg;base64,"
	case "image/png":
		base64Encoding += "data:image/png;base64,"
	}

	// Добавим закодированное в base64 изображение
	base64Encoding += toBase64(bytes)

	// Выведем полное base64-представление изображения
	return base64Encoding
}
