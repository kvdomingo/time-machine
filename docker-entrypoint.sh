#!/bin/sh

python manage.py migrate
python manage.py createsuperuser --noinput || true

if [ "$PYTHON_ENV" = "development" ]; then
  exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py --reload
elif [ "$PYTHON_ENV" = "lab" ]; then
  python manage.py collectstatic --noinput
  exec gunicorn --bind unix:/var/run/gunicorn.sock --config ./gunicorn.conf.py
else
  python manage.py collectstatic --noinput
  exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py
fi
