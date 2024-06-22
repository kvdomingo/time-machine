package textLog

import (
    "context"
    "fmt"
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/log"
    "github.com/jackc/pgx/v5/pgtype"
    "time-machine/database"
    "time-machine/internal/parsers"
    "time-machine/internal/sql"
    "time-machine/internal/validation"
    "time-machine/models"
)

func List(ctx *fiber.Ctx) error {
    var err error
    var errResp []validation.ErrorResponse

    var queries models.ListTextLogInput
    err = ctx.QueryParser(&queries)
    if err != nil {
        return fmt.Errorf("error parsing query params: %v", err)
    }

    validator := validation.GetValidatorInstance()
    errResp = validator.Validate(queries)
    if len(errResp) > 0 {
        return ctx.Status(fiber.StatusBadRequest).JSON(errResp)
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
    textLog, err := q.ListTextLog(
        context.Background(), sql.ListTextLogParams{
            StartDate: pgtype.Date{Time: *parsedStartDate, Valid: true},
            EndDate:   pgtype.Date{Time: *parsedEndDate, Valid: true},
        },
    )
    if err != nil {
        log.Error(err)
        return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
    }

    if len(textLog) == 0 {
        return ctx.JSON(
            models.TextLog{
                time.Now().Format(time.DateOnly): []models.ReducedListTextLogRow{},
            },
        )
    }

    formattedTextLog := models.TextLog{}
    for _, row := range textLog {
        key := row.RecordDate.Time.Format(time.DateOnly)
        formattedTextLog[key] = append(
            formattedTextLog[key], models.ReducedListTextLogRow{
                Tag:        row.Tag,
                Duration:   row.Duration,
                Activities: row.Activities,
            },
        )
    }
    return ctx.JSON(formattedTextLog)
}
