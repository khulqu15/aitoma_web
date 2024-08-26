package controller

import (
	"net/http"
	"payment/helper"
	"payment/model"
	"payment/service"

	"github.com/gin-gonic/gin"
)

type MidtransControllerImpl struct {
	MidtransService service.MidtransService
}

func NewMidtransControllerImpl(midtransController service.MidtransService) *MidtransControllerImpl {
	return &MidtransControllerImpl{
		MidtransService: midtransController,
	}
}

func (controller *MidtransControllerImpl) Create(c *gin.Context) {
	var request model.MidtransRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		helper.PanicIfError(err)
	}

	midtransResponse := controller.MidtransService.Create(c, request)
	webResponse := model.WebResponse{
		Code:   http.StatusOK,
		Status: "OK",
		Data:   midtransResponse,
	}
	c.JSON(http.StatusOK, webResponse)
}
