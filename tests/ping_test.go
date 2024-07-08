package tests

import (
	"minireipaz/pkg/common"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestPing(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string

		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "ping pong",
			expectedStatus: 200,
			expectedBody:   `{"ping":"pong"}`,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			common.Ping(c)

			if !reflect.DeepEqual(tt.expectedStatus, w.Code) {
				t.Errorf("Expected %v Got %v", tt.expectedStatus, w.Code)
			}

			if !reflect.DeepEqual(tt.expectedBody, w.Body.String()) {
				t.Errorf("Expected %v Got %v", tt.expectedBody, w.Body.String())
			}
		})
	}
}
