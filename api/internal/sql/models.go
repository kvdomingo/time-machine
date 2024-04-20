// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package sql

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Checkin struct {
	ID         string             `json:"id"`
	Created    pgtype.Timestamptz `json:"created"`
	Modified   pgtype.Timestamptz `json:"modified"`
	Duration   float64            `json:"duration"`
	StartTime  pgtype.Timestamptz `json:"start_time"`
	RecordDate pgtype.Date        `json:"record_date"`
	Tag        string             `json:"tag"`
	Activities string             `json:"activities"`
}
