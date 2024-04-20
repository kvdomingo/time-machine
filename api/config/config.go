package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2/log"
)

const (
	PageSize = 10
)

type EnvMissingError struct {
	env string
}

func (e *EnvMissingError) Error() string {
	log.Errorf("Required env is missing: %s", e.env)
	return "Invalid configuration value"
}

type EnvValueError struct {
	env string
}

func (e *EnvValueError) Error() string {
	log.Errorf("Env has invalid value: %s", e.env)
	return "Invalid configuration value"
}

func getEnvString(key string) string {
	var val string
	var ok bool
	if val, ok = os.LookupEnv(key); !ok {
		log.Fatal(&EnvMissingError{env: key})
	}
	return val
}

func getEnvStringWithFallback(key string, fallback string) string {
	var val string
	var ok bool
	if val, ok = os.LookupEnv(key); !ok {
		return fallback
	}
	return val
}

func getEnvBool(key string) bool {
	str := getEnvStringWithFallback(key, "false")
	env, err := strconv.ParseBool(str)
	if err != nil {
		log.Fatal(&EnvValueError{env: key})
	}
	return env
}

func DatabaseHost() string {
	return getEnvString("POSTGRESQL_HOST")
}

func DatabasePort() string {
	return getEnvStringWithFallback("POSTGRESQL_PORT", "5432")
}

func DatabaseUser() string {
	return getEnvString("POSTGRESQL_USERNAME")
}

func DatabasePassword() string {
	return getEnvStringWithFallback("POSTGRESQL_PASSWORD", "")
}

func DatabaseName() string {
	return getEnvString("POSTGRESQL_DATABASE")
}

func DatabaseConnectionString() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		DatabaseUser(),
		DatabasePassword(),
		DatabaseHost(),
		DatabasePort(),
		DatabaseName(),
	)
}

func IsProduction() bool {
	return getEnvBool("PRODUCTION")
}

func Port() string {
	return getEnvStringWithFallback("PORT", "8000")
}
