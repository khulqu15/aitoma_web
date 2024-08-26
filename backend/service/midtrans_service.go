package service

import (
	"payment/model"

	"github.com/gin-gonic/gin"
)

type MidtransService interface {
	Create(c *gin.Context, request model.MidtransRequest) model.MidtransResponse
}
