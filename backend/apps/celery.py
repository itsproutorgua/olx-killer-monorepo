import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

app = Celery('OLX Clone')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
