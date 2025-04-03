#!/bin/bash

set -e

sleep 10

if ! python manage.py showmigrations | grep '\[X\]'; then
    python manage.py makemigrations
    python manage.py migrate
fi

echo "Checking for locations..."
if ! python manage.py shell -c "from apps.locations.models import Location; \
print(Location.objects.exists())" | grep -q True; then
    echo "Creating locations..."
    python manage.py create_regions_and_cities
else
    echo "Locations already exist."
fi

echo "Checking for currency..."
if ! python manage.py shell -c "from apps.products.models import Currency; \
print(Currency.objects.exists())" | grep -q True; then
    echo "Creating currency..."
    python manage.py create_currency
else
    echo "Currency already exists."
fi

echo "Checking for categories..."
if ! python manage.py shell -c "from apps.products.models import Category; \
print(Category.objects.exists())" | grep -q True; then
    echo "Creating OLX categories..."
    python manage.py create_olx_categories
    echo "Creating fixtures..."
    python manage.py load_fixtures
    echo "Filling in the history..."
    python manage.py populate_history --auto
else
    echo "Categories already exist."
    echo "Fixtures already exist."
fi

echo "Checking for superuser..."
if ! python manage.py shell -c "from django.contrib.auth import get_user_model; \
print(get_user_model().objects.filter(is_superuser=True).exists())" | grep -q True; then
    echo "Creating default superuser..."
    python manage.py create_default_superuser
else
    echo "Superuser already exists."
fi

django-admin compilemessages
python manage.py collectstatic --no-input --clear

exec gunicorn -c gunicorn_config.py apps.wsgi:application
