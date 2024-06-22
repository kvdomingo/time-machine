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
    "time-machine/handlers"
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

    api.Get("/checkin", handlers.CheckinList)
    api.Get("/checkin-all", handlers.CheckinListAllByDate)
    api.Post("/checkin", handlers.CheckinCreate)
    api.Get("/checkin/:id", handlers.CheckinRetrieve)
    api.Put("/checkin/:id", handlers.CheckinUpdate)
    api.Delete("/checkin/:id", handlers.CheckinDelete)
    api.Get("/textLog", handlers.TextLogList)
    api.Get("/tag", handlers.TagList)

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
