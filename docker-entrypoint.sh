#!/bin/sh

if [ "$PYTHON_ENV" = "development" ]; then
  python manage.py migrate
  python manage.py createsuperuser --noinput || true
  exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py --reload
else
  exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py
fi
