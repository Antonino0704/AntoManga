#!/bin/bash
set -euo pipefail

echo "Starting Django application setup..."

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --ignore=rest_framework

echo "Creating superuser if it does not exist..."
python manage.py createsuperuser --noinput || echo "Superuser already exists."

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3