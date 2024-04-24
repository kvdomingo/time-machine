FROM migrate/migrate:v4.17.1

WORKDIR /

COPY ./api/migrations/ /migrations/
