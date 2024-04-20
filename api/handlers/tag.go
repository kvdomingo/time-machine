package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"time-machine/database"
)

func TagList(ctx *fiber.Ctx) error {
	q := database.Get()
	tags, err := q.ListTags(context.Background())
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).Send(make([]byte, 0))
	}

	if len(tags) == 0 {
		return ctx.JSON([]string{})
	}
	return ctx.JSON(tags)
}
