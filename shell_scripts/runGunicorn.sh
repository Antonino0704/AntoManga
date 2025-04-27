#!/bin/bash

cd ../

# Activate env
source venv/bin/activate

# Run Gunicorn
cd src/
gunicorn config.wsgi:application --bind 0.0.0.0:8000
