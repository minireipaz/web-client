package tests

import (
	"minireipaz/pkg/users"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestHandleUsers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		paramName      string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "With name parameter",
			paramName:      "John",
			expectedStatus: http.StatusOK,
			expectedBody:   "User: John",
		},
		{
			name:           "Without name parameter",
			paramName:      "",
			expectedStatus: http.StatusOK,
			expectedBody:   "User: ",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Params = []gin.Param{
				{Key: "name", Value: tt.paramName},
			}

			users.HandleUsers(c)
			if !reflect.DeepEqual(tt.expectedStatus, w.Code) {
				t.Errorf("Expected %v Got %v", tt.expectedStatus, w.Code)
			}

			if !reflect.DeepEqual(tt.expectedBody, w.Body.String()) {
				t.Errorf("Expected %v Got %v", tt.expectedBody, w.Body.String())
			}
		})
	}
}
