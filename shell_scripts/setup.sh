#!/bin/bash

cd "$(cd "$(dirname "{BASH_SOURCE[0]}")" && pwd)"
cd ../

# install env
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# run setup script
cd src/
python core/setup.py

python manage.py makemigrations series
python manage.py makemigrations publishers
python manage.py makemigrations users
python manage.py migrate

python manage.py createsuperuser
