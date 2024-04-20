package parsers

import (
	"math"
	"time"
)

func parseDateString(rawDate string) (*time.Time, error) {
	if rawDate == "" {
		return nil, nil
	}

	parsedDate, err := time.Parse(time.DateOnly, rawDate)
	if err != nil {
		return nil, err
	}

	return &parsedDate, nil
}

func ParseStartDateString(rawDate string) (*time.Time, error) {
	parsedDate, err := parseDateString(rawDate)
	if err != nil {
		return nil, err
	}

	if parsedDate == nil {
		minDate := time.Unix(0, 0)
		return &minDate, nil
	}

	return parsedDate, nil
}

func ParseEndDateString(rawDate string) (*time.Time, error) {
	parsedDate, err := parseDateString(rawDate)
	if err != nil {
		return nil, err
	}

	if parsedDate == nil {
		maxDate := time.Unix(math.MaxInt64, math.MaxInt32)
		return &maxDate, nil
	}

	return parsedDate, nil
}
