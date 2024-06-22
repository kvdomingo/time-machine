package main

import (
    "flag"
    "fmt"
    "log"

    "github.com/gofiber/contrib/swagger"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/healthcheck"
    "github.com/gofiber/fiber/v2/middleware/helmet"
    "github.com/gofiber/fiber/v2/middleware/idempotency"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/gofiber/fiber/v2/middleware/monitor"
    "github.com/gofiber/fiber/v2/middleware/recover"
    _ "github.com/golang-migrate/migrate/v4"
    "time-machine/config"
    "time-machine/database"
    "time-machine/handlers/checkin"
    "time-machine/handlers/tag"
    "time-machine/handlers/textLog"
)

// @title Time Machine
// @version 4.0.0
// @contact.email hello@kvd.studio
func main() {
    flag.Parse()

    err := database.NewPool()
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }
    defer database.ClosePool()

    app := fiber.New(
        fiber.Config{
            Prefork:           false,
            AppName:           "Time Machine",
            ServerHeader:      "GoFiber/TimeMachine",
            StrictRouting:     true,
            EnablePrintRoutes: true,
        },
    )

    app.Use(recover.New())
    app.Use(logger.New())
    app.Use(
        healthcheck.New(
            healthcheck.Config{
                LivenessEndpoint: "/api/live",
                LivenessProbe: func(c *fiber.Ctx) bool {
                    return true
                },
                ReadinessEndpoint: "/api/ready",
                ReadinessProbe: func(c *fiber.Ctx) bool {
                    return true
                },
            },
        ),
    )
    app.Use(helmet.New())
    app.Use(idempotency.New())
    app.Use(
        swagger.New(
            swagger.Config{
                Title:    "Time Machine",
                BasePath: "/api",
                Path:     "/docs",
                FilePath: "docs/swagger.json",
            },
        ),
    )

    api := app.Group("/api")

    api.Use(
        healthcheck.New(
            healthcheck.Config{
                LivenessEndpoint: "/live",
                LivenessProbe: func(ctx *fiber.Ctx) bool {
                    return true
                },
                ReadinessEndpoint: "/ready",
                ReadinessProbe: func(ctx *fiber.Ctx) bool {
                    return true
                },
            },
        ),
    )

    api.Get(
        "/metrics", monitor.New(
            monitor.Config{
                Title: "Time Machine",
            },
        ),
    )

    api.Get("/checkin", checkin.List)
    api.Get("/checkin-all", checkin.ListAllByDate)
    api.Get("/checkin-stats", checkin.GetStatsByDate)
    api.Post("/checkin", checkin.Create)
    api.Get("/checkin/:id", checkin.Retrieve)
    api.Put("/checkin/:id", checkin.Update)
    api.Delete("/checkin/:id", checkin.Delete)
    api.Get("/textLog", textLog.List)
    api.Get("/tag", tag.List)

    if config.IsProduction() {
        app.Static("/", "./static")

        app.Get(
            "*", func(ctx *fiber.Ctx) error {
                return ctx.SendFile("./static/index.html")
            },
        )
    }

    log.Fatal(app.Listen(fmt.Sprintf(":%s", config.Port())))
}
