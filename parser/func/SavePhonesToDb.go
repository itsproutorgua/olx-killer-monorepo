package olxparser

import (
	models "olxparser/models"
	"olxparser/set"

	"gorm.io/driver/mysql"
	//"gorm.io/driver/postgres"

	"gorm.io/gorm"
)

func SavePhonesToDb(Phone string, OlxId int) {

	//return

	dsn := set.DSN
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.DbPhones{})

	//Create
	db.Create(&models.DbPhones{
		OlxId: OlxId,
		Phone: Phone,
	})
}
