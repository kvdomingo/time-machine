package database

import (
	"context"

	"github.com/gofiber/fiber/v2/log"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	"time-machine/config"
	"time-machine/internal/sql"
)

var pool *pgxpool.Pool

func NewPool() error {
	var err error
	pool, err = pgxpool.New(context.Background(), config.DatabaseConnectionString())
	if err != nil {
		return err
	}
	log.Info("Database connection pool established")
	return nil
}

func ClosePool() {
	if pool != nil {
		pool.Close()
	}
}

func Get() *sql.Queries {
	return sql.New(pool)
}
