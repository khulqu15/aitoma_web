package middleware

import (
	"errors"
	"net/http"
	"payment/helper"
	"payment/model"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func ErrorHandle() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, err any) {
		if validationErrors(c, err) {
			return
		}
		internalServerError(c, err)
	})
}

func validationErrors(c *gin.Context, err any) bool {
	if exception, ok := err.(validator.ValidationErrors); ok {
		var ve validator.ValidationErrors
		out := make([]model.ErrorResponse, len(ve))
		if errors.As(exception, &ve) {
			for _, fe := range ve {
				out = append(out, model.ErrorResponse{
					Field:   fe.Field(),
					Message: helper.MessageForTag(fe.Tag()),
				})
			}
		}
		webResponse := model.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   out,
		}
		c.JSON(http.StatusBadRequest, webResponse)
		c.Abort()
		return true
	} else {
		return false
	}
}

func internalServerError(c *gin.Context, err any) {
	webResponse := model.WebResponse{
		Code:   http.StatusInternalServerError,
		Status: "INTERNAL SERVER ERROR",
		Data:   err,
	}
	c.JSON(http.StatusInternalServerError, webResponse)
	c.Abort()
}
