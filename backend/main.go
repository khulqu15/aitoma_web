package main

import (
	"payment/controller"
	"payment/initializer"
	"payment/middleware"
	"payment/service"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func init() {
	initializer.LoadEnv()
}

func main() {
	validate := validator.New()
	midtransService := service.NewMidtransServiceImpl(validate)
	midtransController := controller.NewMidtransControllerImpl(midtransService)
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8100"}, // Add your frontend's URL here
		AllowMethods:     []string{"POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(middleware.ErrorHandle())
	midtrans := r.Group("/midtrans")
	{
		midtrans.POST("/create", midtransController.Create)
	}
	r.Run()
}
