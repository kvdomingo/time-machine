-- name: GetCheckin :one
SELECT id,
       created,
       modified,
       duration,
       CONCAT_WS(
               ':',
               LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
               LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       ) AS start_time,
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
       ROUND(duration::NUMERIC, 5)::FLOAT AS duration,
       CONCAT_WS(
               ':',
               LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
               LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       )                                  AS start_time,
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
       ROUND(duration::NUMERIC, 5)::FLOAT AS duration,
       CONCAT_WS(
               ':',
               LPAD(EXTRACT(HOUR FROM start_time)::TEXT, 2, '0'),
               LPAD(EXTRACT(MINUTE FROM start_time)::TEXT, 2, '0')
       )                                  AS start_time,
       record_date,
       tag,
       activities
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date;

-- name: GetCheckinStatsByDate :many
SELECT tag, ROUND(SUM(duration)::NUMERIC, 5)::FLOAT AS duration
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
GROUP BY tag
ORDER BY duration;

-- name: GetCheckinStatsByDateTag :many
SELECT ROUND(SUM(duration)::NUMERIC, 5)::FLOAT AS duration, activities
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
  AND tag = @tag
GROUP BY activities
ORDER BY duration;

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
INSERT INTO checkin (duration,
                     start_time,
                     record_date,
                     tag,
                     activities)
VALUES ($1,
        $2,
        $3,
        $4,
        $5)
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
       ROUND(SUM(duration)::NUMERIC, 5)::FLOAT AS duration,
       activities,
       MIN(start_time::TIME)                   AS start_time
FROM checkin
WHERE record_date >= @start_date
  AND record_date <= @end_date
GROUP BY record_date, tag, activities
ORDER BY record_date, start_time;
