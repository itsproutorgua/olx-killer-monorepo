package olxparser

import (
	models "olxparser/models"

	"gorm.io/driver/mysql"
	//"gorm.io/driver/postgres"

	"gorm.io/gorm"
)

func SaveToDb(OlxAd models.OlxAd) {

	//return

	dsn := "upw:2HSxItC4lHIdftIZ@tcp(65.109.112.40:3306)/upw?charset=utf8&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.DbPhones{}, &models.DbUser{},
		&models.DbParam{}, &models.DbCategory{}, &models.DbParamValue{},
		&models.DbPhoto{}, &models.DbContact{}, &models.DbAd{})

	//for _, OlxAd := range Ads.OlxData {
	//Create
	db.Create(&models.DbAd{
		OlxId:           OlxAd.OlxId,
		Url:             OlxAd.Url,
		Description:     OlxAd.Description,
		Title:           OlxAd.Title,
		LastRefreshTime: OlxAd.LastRefreshTime,
		Status:          OlxAd.Status,
	})

	db.Create(&models.DbContact{
		OlxId:     OlxAd.OlxId,
		Name:      OlxAd.Contact.Name,
		IsPhone:   OlxAd.Contact.IsPhone,
		IsChat:    OlxAd.Contact.IsChat,
		IsCourier: OlxAd.Contact.IsCourier,
	})

	db.Create(&models.DbUser{
		OlxId:     OlxAd.OlxId,
		OlxUserId: OlxAd.User.OlxUserId,
		Name:      OlxAd.Contact.Name,
	})

	db.Create(&models.DbCategory{
		OlxId:    OlxAd.OlxId,
		OlxCatId: OlxAd.Category.OlxCatId,
		Type:     OlxAd.Category.Type,
	})

	for _, OlxParam := range OlxAd.Params {
		db.Create(&models.DbParam{
			OlxId: OlxAd.OlxId,
			Key:   OlxParam.Key,
			Name:  OlxParam.Name,
		})

		db.Create(&models.DbParamValue{
			OlxId:          OlxAd.OlxId,
			Value:          OlxParam.Value.Value,
			Type:           OlxParam.Value.Type,
			Currency:       OlxParam.Value.Currency,
			ConvertedValue: OlxParam.Value.ConvertedValue,
		})
	}

	for _, Photo := range OlxAd.Photos {
		db.Create(&models.DbPhoto{
			OlxId:      OlxAd.OlxId,
			OlxPhotoId: Photo.OlxPhotoId,
			Filename:   Photo.Filename,
			Link:       Photo.Link,
			Width:      Photo.Width,
			Height:     Photo.Height,
		})
	}
	//}
}
