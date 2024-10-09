package olxparser

import (
	"encoding/base64"
	"log"
	"net/http"
	"os"
)

func toBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func ImageToBase64(filename string) string {
	// Read the image file as a slice of bytes
	bytes, err := os.ReadFile(filename)
	if err != nil {
		log.Fatal(err)
	}

	var base64Encoding string

	// Determine the MIME type of the image
	mimeType := http.DetectContentType(bytes)

	// Add the appropriate URI scheme header depending on the MIME type
	switch mimeType {
	case "image/jpeg":
		base64Encoding += "data:image/jpeg;base64,"
	case "image/png":
		base64Encoding += "data:image/png;base64,"
	}

	// Add a base64 encoded image
	base64Encoding += toBase64(bytes)

	// Return the full base64 encoded image
	return base64Encoding
}
