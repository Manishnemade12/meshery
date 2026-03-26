package handlers

import (
	"testing"

	"github.com/meshery/meshery/server/models"
)

func TestGetUserCredentials_OrderSanitization(t *testing.T) {
	tests := []struct {
		name        string
		orderInput  string
		expectOrder string
	}{
		{"valid order with desc", "updated_at desc", "updated_at desc"},
		{"valid order with asc", "name asc", "name asc"},
		{"invalid order - missing direction", "created_at", "created_at desc"}, // gets rejected by SanitizeOrderInput, handler defaults it
		{"invalid order - SQL injection", "created_at; DROP TABLE credentials;--", "created_at desc"}, // gets rejected, handler defaults it
		{"empty order", "", "created_at desc"}, // gets rejected, handler defaults it
	}

	validColumns := []string{"created_at", "updated_at", "name", "type"}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Simulate the exact logic in GetUserCredentials handler
			sanitized := models.SanitizeOrderInput(tt.orderInput, validColumns)
			if sanitized == "" {
				sanitized = "created_at desc"
			}

			if sanitized != tt.expectOrder {
				t.Errorf("expected %q, got %q", tt.expectOrder, sanitized)
			}
		})
	}
}
