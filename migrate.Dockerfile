FROM golang:1.21

WORKDIR /migrate

RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

COPY ./api/migrations/ ./migrations/
