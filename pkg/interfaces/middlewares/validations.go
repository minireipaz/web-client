package middlewares

import (
	"errors"
	"log"
	"minireipaz/pkg/domain/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	ErrorInvalidJSON          = "invalid JSON data"
	ErrorWorkflowNameRequired = "workflow name is required"
	ErrorDirectoryRequired    = "directory to save is required"
	ErrorSubUserRequired      = "sub user is required"
	ErrorIDWorkflowRequired   = "id workflow user is required"
	ErrorInvalidDrecDataType  = "invalid cred type"
	ErrorInvalidWorkflowName  = "workflow name must be between 3 and 50 characters"
	ErrorInvalidSub           = "sub user must be greater than 3 characters"
	ErrorInvalidWorkflowID    = "id workflow must be greater than 3 characters"
)

func ValidateWorkflow() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var workflow models.Workflow
		if err := ctx.ShouldBindJSON(&workflow); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if err := validateWorkflowFields(&workflow); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set(models.ValidateWorkflowContextKey, workflow)
		ctx.Next()
	}
}

func ValidateUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var currentUser models.Users
		if err := ctx.ShouldBindJSON(&currentUser); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if err := validateUserFields(&currentUser); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set(models.ValidateUserContextKey, currentUser)
		ctx.Next()
	}
}

func ValidateUserID() gin.HandlerFunc {
	return func(ctx *gin.Context) {
    log.Print("1")
		idUser := ctx.Param("iduser")

		if err := validateUserID(idUser); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}
    log.Print("2")
		ctx.Next()
	}
}

func ValidateGetWorkflow() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idUser := ctx.Param("iduser")
		if err := validateUserID(idUser); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		idWorkflow := ctx.Param("idworkflow")
		if err := validateIDWorkflow(idWorkflow); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

func ValidateUpdateWorkflow() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var currentReq models.RequestUpdateWorkflow
		if err := ctx.ShouldBindJSON(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if err := validateWorkflowFields(&currentReq.WorkflowFrontend); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set(models.RequestUpdateWorkflowContextKey, currentReq)
		ctx.Next()
	}
}

func ValidateCredential() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var currentReq models.RequestCreateCredential
		if err := ctx.ShouldBindJSON(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if err := validateCredentialFields(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set(models.CredentialCreateContextKey, currentReq)
		ctx.Next()
	}
}

func ValidateCredentialExchange() gin.HandlerFunc {
	return func(ctx *gin.Context) {
    log.Print("2 pased")
		var currentReq models.ResponseExchangeCredential
		if err := ctx.ShouldBindJSON(&currentReq); err != nil {
      log.Print("!!!2 pased")
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if err := validateCredentialFields(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set(models.CredentialExchangeContextKey, currentReq)
		ctx.Next()
	}
}

func ValidateGetGoogleSheet() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var currentReq models.RequestGoogleAction
		if err := ctx.ShouldBindBodyWithJSON(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		if !models.ValidCredentialTypes[currentReq.Type] {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": ErrorInvalidJSON})
			ctx.Abort()
			return
		}

		ctx.Set(models.ActionGoogleKey, currentReq)
		ctx.Next()
	}
}

func validateWorkflowFields(workflow *models.Workflow) error {
	if strings.TrimSpace(workflow.Name) == "" {
		return errors.New(ErrorWorkflowNameRequired)
	}
	if len(workflow.Name) < 3 || len(workflow.Name) > 50 {
		return errors.New(ErrorInvalidWorkflowName)
	}
	if strings.TrimSpace(workflow.DirectoryToSave) == "" {
		return errors.New(ErrorDirectoryRequired)
	}
	return nil
}

func validateUserFields(user *models.Users) error {
	if strings.TrimSpace(user.UserID) == "" {
		return errors.New(ErrorSubUserRequired)
	}
	if len(user.UserID) < 3 {
		return errors.New(ErrorInvalidSub)
	}
	return nil
}

func validateUserID(idUser string) error {
	if strings.TrimSpace(idUser) == "" {
		return errors.New(ErrorSubUserRequired)
	}
	if len(idUser) < 3 {
		return errors.New(ErrorInvalidSub)
	}
	return nil
}

func validateIDWorkflow(idWorkflow string) error {
	if strings.TrimSpace(idWorkflow) == "" {
		return errors.New(ErrorIDWorkflowRequired)
	}
	if len(idWorkflow) < 3 {
		return errors.New(ErrorInvalidWorkflowID)
	}
	return nil
}

func validateCredentialFields(credential models.Credential) error {
	if strings.TrimSpace(credential.GetName()) == "" {
		return errors.New(ErrorWorkflowNameRequired)
	}
	if len(credential.GetName()) < 3 || len(credential.GetName()) > 150 {
		return errors.New(ErrorInvalidWorkflowName)
	}
	if strings.TrimSpace(credential.GetSub()) == "" {
		return errors.New(ErrorDirectoryRequired)
	}
	if !models.ValidCredentialTypes[credential.GetType()] {
		return errors.New(ErrorInvalidDrecDataType)
	}
	return nil
}

func ValidateIDAction() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idaction := ctx.Param("idaction")
    log.Print("3")
		if err := validateActionID(idaction); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}
    log.Print("4")
		ctx.Next()
	}
}

func validateActionID(_ string) error {
	return nil
}
