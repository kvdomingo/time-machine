package formatters

import "github.com/guregu/null/v5"

type PagedResponse[T any] struct {
	Count    int64       `json:"count"`
	Next     null.String `json:"next"`
	Previous null.String `json:"previous"`
	Results  []T         `json:"results"`
}
