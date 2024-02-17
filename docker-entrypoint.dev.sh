#!/bin/sh

set -eu

poetry install --no-root --no-interaction --no-ansi --with dev

poetry run python manage.py migrate
poetry run python manage.py createsuperuser --noinput || true

exec poetry run gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py --reload
