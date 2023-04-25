#!/bin/sh

python manage.py migrate
python manage.py createsuperuser --noinput || true

if [ "$PYTHON_ENV" != "development" ]; then
  python manage.py collectstatic --noinput
  reload_flag=""
else
  reload_flag="--reload"
fi

exec gunicorn --bind 0.0.0.0:5000 --config ./gunicorn.conf.py $reload_flag
