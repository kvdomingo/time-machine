FROM oven/bun:1.1-alpine AS build-ui

WORKDIR /web

COPY ./ui/ ./

RUN bun install && bun run build

FROM golang:1.21 AS build-api

ENV CGO_ENABLED 0
ENV GOOS linux
ENV GOARCH amd64

WORKDIR /build

COPY ./api ./

RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest && \
    go mod download && \
    go build -a -o app .

FROM scratch AS prod

WORKDIR /app

COPY --from=build-api /build/app /app/app
COPY ./api/docs/ /app/docs/
COPY --from=build-ui /web/dist/ /app/static

ENTRYPOINT [ "/app/app" ]
