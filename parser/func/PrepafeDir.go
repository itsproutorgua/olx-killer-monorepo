package olxparser

import (
	"fmt"
	"os"
)

func PrepareDir(directoryPath string) {

	// Check if folder exist
	_, err := os.Stat(directoryPath)
	if os.IsNotExist(err) {
		// Creating folder
		err := os.MkdirAll(directoryPath, 0755)
		if err != nil {
			HandleMessage(fmt.Sprint("Creating folder error:", err))
		} else {
			HandleMessage("Creating folder success!")
		}
	} else {
		HandleMessage("Folder exists.")
	}
}
