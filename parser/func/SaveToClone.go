package olxparser

import (
	"fmt"
	set "olxparser/set"
	"os"
)

func SaveToClone() {

	PrepareDir(fmt.Sprint(set.DataGetFolder))
	PrepareDir(fmt.Sprint(set.DataSendFolder))
	PrepareDir(fmt.Sprint(set.DataSendFolder, "/ok"))
	PrepareDir(fmt.Sprint(set.DataSendFolder, "/err"))

	files, err := os.ReadDir(set.DataGetFolder)

	if err != nil {
		HandleMessage("Error reading folder:", err)
		return
	}

	SaveToCloneThread(files)

}
