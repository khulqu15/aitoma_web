package service

import (
	"os"
	"payment/helper"
	"payment/model"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type MidtransServiceImpl struct {
	Validate *validator.Validate
}

func NewMidtransServiceImpl(validate *validator.Validate) *MidtransServiceImpl {
	return &MidtransServiceImpl{
		Validate: validate,
	}
}

func (service *MidtransServiceImpl) Create(c *gin.Context, request model.MidtransRequest) model.MidtransResponse {
	err := service.Validate.Struct(request)
	if err != nil {
		helper.PanicIfError(err)
	}

	var snapClient = snap.Client{}
	snapClient.New(os.Getenv("MIDTRANS_SERVER_KEY"), midtrans.Sandbox)

	user_id := strconv.Itoa(request.UserId)
	custAddress := &midtrans.CustomerAddress{
		FName:       "Mohammad Khusnul",
		LName:       "Khuluq",
		Phone:       "0895396004952",
		Address:     "57 Kalisari Damen St, Mulyosari, Surabaya",
		Postcode:    "60112",
		CountryCode: "IDN",
	}

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  "MID-User-" + user_id + "-" + request.ItemId,
			GrossAmt: request.Amount,
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName:    "Mohammad Khusnul",
			LName:    "Khulu",
			Email:    "khusnul.ninno15@gmail.com",
			Phone:    "0895396004952",
			BillAddr: custAddress,
			ShipAddr: custAddress,
		},
		EnabledPayments: snap.AllSnapPaymentType,
		Items: &[]midtrans.ItemDetails{
			{
				ID:    "Property-" + request.ItemId,
				Qty:   1,
				Price: request.Amount,
				Name:  request.ItemName,
			},
		},
	}

	response, errSnap := snapClient.CreateTransaction(req)
	if errSnap != nil {
		helper.PanicIfError(errSnap.GetRawError())
	}

	midtransResponse := model.MidtransResponse{
		Token:       response.Token,
		RedirectUrl: response.RedirectURL,
	}

	return midtransResponse
}
