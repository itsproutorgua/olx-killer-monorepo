package olxparser

import (
	models "olxparser/models"

	"gorm.io/driver/mysql"
	//"gorm.io/driver/postgres"

	"gorm.io/gorm"
)

func SavePhonesToDb(Phone string, OlxId int) {

	//return

	dsn := "upw:2HSxItC4lHIdftIZ@tcp(65.109.112.40:3306)/upw?charset=utf8&parseTime=True&loc=Local"
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
