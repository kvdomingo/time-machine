package models

type CreateCheckinInput struct {
    Duration   float64 `json:"duration" validate:"required,gt=0"`
    StartTime  string  `json:"start_time" validate:"required"`
    RecordDate string  `json:"record_date" validate:"required"`
    Tag        string  `json:"tag" validate:"required"`
    Activities string  `json:"activities" validate:"required"`
}

type ListCheckinsInput struct {
    Page      int32  `json:"page" validate:"gte=0"`
    StartDate string `json:"start_date" validate:"datetime"`
    EndDate   string `json:"end_date" validate:"datetime"`
    Tag       string `json:"tag"`
}

type ListAllCheckinsInput struct {
    StartDate string `json:"start_date" validate:"datetime"`
    EndDate   string `json:"end_date" validate:"datetime"`
}
