#!/bin/sh

set -eu

python manage.py migrate
python manage.py createsuperuser --noinput || true

exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py
