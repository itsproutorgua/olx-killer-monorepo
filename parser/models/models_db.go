package models

import (
	"time"

	"gorm.io/gorm"
)

// gorm.Model definition
type Model struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type DbAd struct {
	gorm.Model
	OlxId           int
	Title           string
	Description     string
	Url             string
	LastRefreshTime string
	Status          string
	//IsProtectPhone  bool
	// Contact         *DbContact
	// User            *DbUser
	// Photos          *DbPhoto
}

type DbPhones struct {
	gorm.Model
	OlxId int
	//Ad    *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Phone string
}

type DbParam struct {
	gorm.Model
	OlxId int
	//Ad    *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Key  string
	Name string
}

type DbParamValue struct {
	gorm.Model
	OlxId int
	//Ad    *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Value          float64
	Type           string
	Currency       string
	ConvertedValue float64
}

type DbUser struct {
	gorm.Model
	OlxId     int
	OlxUserId int
	//Ad     *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Name string
}

type DbCategory struct {
	gorm.Model
	OlxId    int
	OlxCatId int
	//Ad     *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Type string
}

type DbPhoto struct {
	gorm.Model
	OlxId int
	//Ad         *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	OlxPhotoId int
	Filename   string
	Width      int
	Height     int
	Link       string
}

type DbContact struct {
	gorm.Model
	OlxId int
	//Ad        *DbAd `gorm:"foreignKey:OlxId"` // connection with relevant table
	Name      string
	IsPhone   bool
	IsChat    bool
	IsCourier bool
}
