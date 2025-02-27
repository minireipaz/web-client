package controllers

import (
	"fmt"
	"minireipaz/pkg/domain/models"
	"minireipaz/pkg/domain/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CredentialsController struct {
	service     *services.CredentialsService
	authService *services.AuthService
}

func NewCredentialsController(credentialServ *services.CredentialsService, authServ *services.AuthService) *CredentialsController {
	return &CredentialsController{
		service:     credentialServ,
		authService: authServ,
	}
}

func (c *CredentialsController) CreateOAuthCredentials(ctx *gin.Context) {
	currentCredential := ctx.MustGet(models.CredentialCreateContextKey).(models.RequestCreateCredential)
	serviceUserAccessToken, err := c.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	// optimistic
	response := models.ResponseCreateCredential{
		Error:  "",
		Status: http.StatusOK,
	}
	switch currentCredential.Type {
	case models.Googlesheets:
		response = c.service.CreateGoogleCredential(&currentCredential, serviceUserAccessToken)
	default:
		response.Error = models.TypeNotAceptable
		response.Status = http.StatusInternalServerError
	}
	ctx.JSON(response.Status, response)
}

func (c *CredentialsController) CreateCredentials(ctx *gin.Context) {
	currentCredential := ctx.MustGet(models.CredentialCreateContextKey).(models.RequestCreateCredential)
	serviceUserAccessToken, err := c.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	// optimistic
	response := models.ResponseCreateCredential{
		Error:  "",
		Status: http.StatusOK,
	}
	// TODO: replace notiontoken
	switch currentCredential.Type {
	case "notiontoken":
		saved, updatedCredentialStr := c.service.SaveNotionTokenCredential(&currentCredential, serviceUserAccessToken)
		if !saved {
			response.Error = "cannot save"
			response.Status = http.StatusBadRequest
		}
		response.Data = ""
		if updatedCredentialStr != nil {
			response.Data = *updatedCredentialStr
		}
	default:
		response.Error = models.TypeNotAceptable
		response.Status = http.StatusInternalServerError
	}
	ctx.JSON(response.Status, response)
}

func (c *CredentialsController) CallbackCredentials(ctx *gin.Context) {
	currentCredential := ctx.MustGet(models.CredentialExchangeContextKey).(models.ResponseExchangeCredential)
	serviceUserAccessToken, err := c.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}
	// optimistic
	response := &models.ResponseExchangeCredential{
		Error:  "",
		Status: http.StatusOK,
	}
	switch currentCredential.Type {
	case models.Googlesheets:
		response = c.service.ExchangeOAuth(&currentCredential, serviceUserAccessToken)
	default:
		response.Error = models.TypeNotAceptable
		response.Status = http.StatusInternalServerError
	}
	ctx.JSON(response.Status, response)
}

func (c *CredentialsController) GetAllCredentials(ctx *gin.Context) {
	userID := ctx.Param("iduser")
	userToken := ctx.MustGet("usertoken").(string) // it's validated
	serviceUserToken, err := c.authService.GetServiceUserAccessToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":  fmt.Sprintf("Failed to authenticate: %v", err),
			"status": http.StatusInternalServerError,
		})
		return
	}

	allCredentials := c.service.GetAllCredentials(&userID, &userToken, serviceUserToken)

	ctx.JSON(allCredentials.Status, allCredentials)
}
