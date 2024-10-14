import os
from pathlib import Path

from loguru import logger


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

from django.conf import settings  # noqa 402


ROOT_DIR = Path(settings.BASE_DIR)

logger.add(
    ROOT_DIR / 'logs' / 'errors_log.json',
    filter=lambda record: record["level"].name == "ERROR",
    format='{time} {level} {file.path} {message}',
    level='DEBUG',
    rotation='10 MB',
    compression='zip',
    serialize=True,
)
