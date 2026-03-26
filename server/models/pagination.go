package models

import (
	"fmt"
	"net/http"
	"strconv"
)

const (
	DefaultPage     = 0
	DefaultPageSize = 10
	MaxPageSize     = 100
)

type Pagination struct {
	Page     int
	PageSize int
}

// ParsePagination extracts and validates page and page_size from the request.
// It normalizes 'pagesize' and 'page_size' and protects against oversized queries.
func ParsePagination(r *http.Request) (Pagination, error) {
	q := r.URL.Query()
	p := Pagination{Page: DefaultPage, PageSize: DefaultPageSize}

	if pageStr := q.Get("page"); pageStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 0 {
			return p, fmt.Errorf("invalid 'page' parameter: must be a non-negative integer")
		}
		p.Page = page
	}

	// Support both casing conventions temporarily for backward compatibility
	pageSizeStr := q.Get("page_size")
	if pageSizeStr == "" {
		pageSizeStr = q.Get("pagesize")
	}

	if pageSizeStr != "" && pageSizeStr != "all" {
		pageSize, err := strconv.Atoi(pageSizeStr)
		if err != nil || pageSize <= 0 {
			return p, fmt.Errorf("invalid 'page_size' parameter: must be a positive integer")
		}
		if pageSize > MaxPageSize {
			pageSize = MaxPageSize // Enforce global cap to prevent memory exhaustion
		}
		p.PageSize = pageSize
	}

	return p, nil
}
