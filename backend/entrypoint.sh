#!/bin/bash

set -e

mkdir -p /code/setup

if [ ! -f /code/setup/db_initialized ]; then
    python manage.py makemigrations
    python manage.py migrate

    touch /code/setup/db_initialized
fi

if ! python manage.py shell -c "from django.contrib.auth import get_user_model; get_user_model().objects.filter(is_superuser=True).exists()"; then
    python manage.py create_default_superuser
fi

if ! python manage.py shell -c "from apps.locations.models import Location; Location.objects.exists()"; then
    python manage.py create_locations
fi

if ! python manage.py shell -c "from apps.products.models import Currency; Currency.objects.exists()"; then
    python manage.py create_currency
fi

if ! python manage.py shell -c "from apps.products.models import Category; Category.objects.exists()"; then
    python manage.py create_olx_categories
fi

if [ ! -f /code/setup/fixtures_loaded ]; then
    python manage.py load_fixtures

    touch /code/setup/fixtures_loaded
fi

if [ ! -f /code/setup/static_collected ]; then
    python manage.py collectstatic --no-input --clear

    touch /code/setup/static_collected
fi

if [ ! -f /code/setup/messages_compiled ]; then
    django-admin compilemessages

    touch /code/setup/messages_compiled
fi

python manage.py runserver 0.0.0.0:8000
