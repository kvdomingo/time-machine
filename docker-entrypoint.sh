#!/bin/bash

python manage.py migrate
python manage.py createsuperuser --noinput || true

if [[ "$PYTHON_ENV" != "development" ]]; then
  python manage.py collectstatic --noinput
  exec gunicorn --bind 0.0.0.0:$PORT --config ./gunicorn.conf.py
else
  exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py --reload
fi
