CREATE EXTENSION IF NOT EXISTS "pg_idkit";

CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS
$$
BEGIN
    IF ROW (NEW.*) IS DISTINCT FROM ROW (OLD.*) THEN
        NEW.modified = now();
        RETURN NEW;
    ELSE
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE 'plpgsql';

CREATE TABLE checkin (
    id          VARCHAR(24) PRIMARY KEY DEFAULT idkit_cuid2_generate(),
    created     timestamptz             DEFAULT now(),
    modified    timestamptz             DEFAULT now(),
    duration    float        NOT NULL,
    start_time  timestamptz  NOT NULL,
    record_date date         NOT NULL,
    tag         VARCHAR(255) NOT NULL,
    activities  VARCHAR(255) NOT NULL
);

CREATE TRIGGER update_checkin_modified_time
    BEFORE UPDATE
    ON checkin
    FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
