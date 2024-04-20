package models

type ListTextLogInput struct {
	StartDate string `json:"start_date" validate:"datetime"`
	EndDate   string `json:"end_date" validate:"datetime"`
}

type ReducedListTextLogRow struct {
	Tag        string  `json:"tag"`
	Duration   float64 `json:"duration"`
	Activities string  `json:"activities"`
}

type TextLog = map[string][]ReducedListTextLogRow
