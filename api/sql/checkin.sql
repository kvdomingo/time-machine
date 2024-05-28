-- name: GetCheckin :one
SELECT id,
       created,
       modified,
       duration,
       CONCAT_WS(
           ':',
           LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
           LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       ) as start_time,
       record_date,
       tag,
       activities
FROM checkin
WHERE id = $1
LIMIT 1;

-- name: ListCheckins :many
SELECT id,
       created,
       modified,
       duration,
       CONCAT_WS(
           ':',
           LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
           LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       ) as start_time,
       record_date,
       tag,
       activities
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
  AND (tag = @tag OR @tag = '')
ORDER BY start_time DESC
LIMIT 10 OFFSET @page_offset;

-- name: ListAllCheckinsByDate :many
SELECT id,
       created,
       modified,
       duration,
       CONCAT_WS(
           ':',
           LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
           LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       ) as start_time,
       record_date,
       tag,
       activities
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date;

-- name: CountAllCheckins :one
SELECT COUNT(*)
FROM checkin;

-- name: CountAllCheckinsByDate :one
SELECT COUNT(*)
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
  AND (tag = @tag OR @tag = '');

-- name: CreateCheckin :one
INSERT INTO checkin (
    duration,
    start_time,
    record_date,
    tag,
    activities
)
VALUES (
           $1,
           $2,
           $3,
           $4,
           $5
       )
RETURNING *;

-- name: UpdateCheckin :one
UPDATE checkin
SET duration    = $2,
    start_time  = $3,
    record_date = $4,
    tag         = $5,
    activities  = $6
WHERE id = $1
RETURNING *;

-- name: DeleteCheckin :exec
DELETE
FROM checkin
WHERE id = $1;

-- name: ListTags :many
SELECT DISTINCT tag AS tags
FROM checkin;

-- name: ListTextLog :many
SELECT record_date,
       tag,
       SUM(duration)::float as duration,
       activities
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
GROUP BY record_date, tag, activities
ORDER BY record_date;
