package middlewares

import (
	"minireipaz/pkg/domain/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func ValidateWorkflow() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var workflow models.Workflow
		if err := ctx.ShouldBindJSON(&workflow); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(workflow.Name) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name is required"})
			ctx.Abort()
			return
		}

		if len(workflow.Name) < 3 || len(workflow.Name) > 50 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name must be between 3 and 50 characters"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(workflow.DirectoryToSave) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Directory to save is required"})
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
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(currentUser.UserID) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user is required"})
			ctx.Abort()
			return
		}

		if len(currentUser.UserID) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user must greater than 3 characters"})
			ctx.Abort()
			return
		}

		ctx.Set(models.ValidateUserContextKey, currentUser)
		ctx.Next()
	}
}

func ValidateUserID() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idUser := ctx.Param("iduser")

		if strings.TrimSpace(idUser) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user is required"})
			ctx.Abort()
			return
		}

		if len(idUser) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user must greater than 3 characters"})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

func ValidateGetWorkflow() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idUser := ctx.Param("iduser")
		if strings.TrimSpace(idUser) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user is required"})
			ctx.Abort()
			return
		}

		if len(idUser) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sub user must greater than 3 characters"})
			ctx.Abort()
			return
		}

		idWorkflow := ctx.Param("idworkflow")

		if strings.TrimSpace(idWorkflow) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID workflow user is required"})
			ctx.Abort()
			return
		}

		if len(idWorkflow) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Id workflow must greater than 3 characters"})
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
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(currentReq.WorkflowFrontend.Name) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name is required"})
			ctx.Abort()
			return
		}

		if len(currentReq.WorkflowFrontend.Name) < 3 || len(currentReq.WorkflowFrontend.Name) > 50 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name must be between 3 and 50 characters"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(currentReq.WorkflowFrontend.DirectoryToSave) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Directory to save is required"})
			ctx.Abort()
			return
		}

		ctx.Set(models.RequestUpdateWorkflowContextKey, currentReq)
		ctx.Next()
	}
}

// not intensive validation
func ValidateCredential() gin.HandlerFunc {
	return func(ctx *gin.Context) { // not intensive validation
		var currentReq models.RequestCreateCredential
		if err := ctx.ShouldBindJSON(&currentReq); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(currentReq.Name) == "" || strings.TrimSpace(currentReq.Name) == " " {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name is required"})
			ctx.Abort()
			return
		}
		// dummy validations
		if len(currentReq.Name) < 3 || len(currentReq.Name) > 150 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name must be between 3 and 150 characters"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(currentReq.Sub) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Directory to save is required"})
			ctx.Abort()
			return
		}

		if !models.ValidCredentialTypes[currentReq.Type] {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid credential type"})
			ctx.Abort()
			return
		}

		ctx.Set(models.CredentialCreateContextKey, currentReq)
		ctx.Next()
	}
}
