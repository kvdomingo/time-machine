package handlers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/guregu/null/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"time-machine/config"
	"time-machine/database"
	"time-machine/internal/formatters"
	"time-machine/internal/parsers"
	"time-machine/internal/sql"
	"time-machine/internal/validation"
	"time-machine/models"
)

func CheckinList(ctx *fiber.Ctx) error {
	var err error
	var errResp []validation.ErrorResponse

	var queries models.ListCheckinsInput
	err = ctx.QueryParser(&queries)
	if err != nil {
		return fmt.Errorf("error parsing query params: %v", err)
	}

	validator := validation.GetValidatorInstance()
	errResp = validator.Validate(queries)
	if len(errResp) > 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(errResp)
	}

	page, err := parsers.ParsePageString(ctx.Query("page", "1"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf("error parsing page: %v", err),
			},
		)
	}

	parsedStartDate, err := parsers.ParseStartDateString(ctx.Query("start_date"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf("error parsing start date: %v", err),
			},
		)
	}

	parsedEndDate, err := parsers.ParseEndDateString(ctx.Query("end_date"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf("error parsing end date: %v", err),
			},
		)
	}

	q := database.Get()
	checkins, err := q.ListCheckins(
		context.Background(), sql.ListCheckinsParams{
			StartDate:  pgtype.Date{Time: *parsedStartDate, Valid: true},
			EndDate:    pgtype.Date{Time: *parsedEndDate, Valid: true},
			PageOffset: config.PageSize * (page - 1),
			Tag:        ctx.Query("tag"),
		},
	)
	if err != nil {
		log.Errorf("error fetching checkins: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	count, err := q.CountAllCheckinsByDate(
		context.Background(), sql.CountAllCheckinsByDateParams{
			StartDate: pgtype.Date{Time: *parsedStartDate, Valid: true},
			EndDate:   pgtype.Date{Time: *parsedEndDate, Valid: true},
		},
	)
	if err != nil {
		log.Errorf("error fetching checkins: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	if len(checkins) == 0 {
		checkins = []sql.ListCheckinsRow{}
	}

	return ctx.JSON(
		formatters.PagedResponse[sql.ListCheckinsRow]{
			Count:    count,
			Next:     null.String{},
			Previous: null.String{},
			Results:  checkins,
		},
	)
}

func CheckinRetrieve(ctx *fiber.Ctx) error {
	ContextBackground := context.Background()
	q := database.Get()
	id := ctx.Params("id")
	checkin, err := q.GetCheckin(ContextBackground, id)
	if err != nil {
		log.Error(err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	return ctx.JSON(checkin)
}

func CheckinCreate(ctx *fiber.Ctx) error {
	ContextBackground := context.Background()
	q := database.Get()
	var checkin sql.Checkin
	var checkinInput models.CreateCheckinInput
	var err error
	var errResp []validation.ErrorResponse
	var parsedStartTime time.Time
	var parsedRecordDate time.Time
	validator := validation.GetValidatorInstance()

	err = ctx.BodyParser(&checkinInput)
	if err != nil {
		return fmt.Errorf("error parsing request body: %v", err)
	}

	errResp = validator.Validate(checkinInput)
	if len(errResp) > 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(errResp)
	}

	parsedStartTime, err = time.Parse("15:04", checkinInput.StartTime)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf(
					"error parsing start_time: %v", err,
				),
			},
		)
	}
	log.Infof("parsedStartTime: %v", parsedStartTime)

	parsedRecordDate, err = time.Parse(time.DateOnly, checkinInput.RecordDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf(
					"error parsing record_date: %v", err,
				),
			},
		)
	}
	log.Infof("parsedRecordDate: %v", parsedRecordDate)

	checkin, err = q.CreateCheckin(
		ContextBackground, sql.CreateCheckinParams{
			Duration:   checkinInput.Duration,
			StartTime:  pgtype.Timestamptz{Time: parsedStartTime, Valid: true},
			RecordDate: pgtype.Date{Time: parsedRecordDate, Valid: true},
			Tag:        checkinInput.Tag,
			Activities: checkinInput.Activities,
		},
	)
	if err != nil {
		log.Error(err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	return ctx.Status(fiber.StatusCreated).JSON(checkin)
}

func CheckinUpdate(ctx *fiber.Ctx) error {
	ContextBackground := context.Background()
	q := database.Get()
	var checkin sql.Checkin
	var checkinInput models.CreateCheckinInput
	var err error
	var errResp []validation.ErrorResponse
	var parsedStartTime time.Time
	var parsedRecordDate time.Time
	validator := validation.GetValidatorInstance()

	id := ctx.Params("id")

	err = ctx.BodyParser(&checkinInput)
	if err != nil {
		return fmt.Errorf("error parsing request body: %v", err)
	}

	errResp = validator.Validate(checkinInput)
	if len(errResp) > 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(errResp)
	}

	parsedStartTime, err = time.Parse("15:04", checkinInput.StartTime)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf(
					"error parsing start_time: %v", err,
				),
			},
		)
	}
	log.Infof("parsedStartTime: %v", parsedStartTime)

	parsedRecordDate, err = time.Parse(time.DateOnly, checkinInput.RecordDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			validation.GlobalErrorHandlerResp{
				Message: fmt.Sprintf(
					"error parsing record_date: %v", err,
				),
			},
		)
	}
	log.Infof("parsedRecordDate: %v", parsedRecordDate)

	checkin, err = q.UpdateCheckin(
		ContextBackground, sql.UpdateCheckinParams{
			ID:         id,
			Duration:   checkinInput.Duration,
			StartTime:  pgtype.Timestamptz{Time: parsedStartTime, Valid: true},
			RecordDate: pgtype.Date{Time: parsedRecordDate, Valid: true},
			Tag:        checkinInput.Tag,
			Activities: checkinInput.Activities,
		},
	)
	if err != nil {
		log.Error(err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	return ctx.Status(fiber.StatusAccepted).JSON(checkin)
}

func CheckinDelete(ctx *fiber.Ctx) error {
	ContextBackground := context.Background()
	q := database.Get()
	id := ctx.Params("id")
	err := q.DeleteCheckin(ContextBackground, id)
	if err != nil {
		log.Error(err)
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	return ctx.Status(fiber.StatusNoContent).Send(make([]byte, 0))
}
