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

		if strings.TrimSpace(workflow.WorkflowName) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name is required"})
			ctx.Abort()
			return
		}

		if len(workflow.WorkflowName) < 3 || len(workflow.WorkflowName) > 50 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Workflow name must be between 3 and 50 characters"})
			ctx.Abort()
			return
		}

		if strings.TrimSpace(workflow.DirectoryToSave) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Directory to save is required"})
			ctx.Abort()
			return
		}

		ctx.Set("workflow", workflow)
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

		if strings.TrimSpace(currentUser.Sub) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stub user is required"})
			ctx.Abort()
			return
		}

		if len(currentUser.Sub) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stub user must greater than 3 characters"})
			ctx.Abort()
			return
		}

		ctx.Set("user", currentUser)
		ctx.Next()
	}
}

func ValidateSub() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idUser := ctx.Param("iduser")

		if strings.TrimSpace(idUser) == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stub user is required"})
			ctx.Abort()
			return
		}

		if len(idUser) < 3 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stub user must greater than 3 characters"})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}
