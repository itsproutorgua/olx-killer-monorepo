import os
from settings.base import BASE_DIR

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            'datefmt': '%d/%b/%Y %H:%M:%S',
        },
        'warning': {
            'format': '[%(asctime)s] WARNING: %(message)s',
            'datefmt': '%d/%b/%Y %H:%M:%S',
        },
        'access': {
            'format': '[%(asctime)s] "%(message)s"',
            'datefmt': '%d/%b/%Y %H:%M:%S',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'warning_console': {
            'class': 'logging.StreamHandler',
            'formatter': 'warning',
        },
        'access_console': {
            'class': 'logging.StreamHandler',
            'formatter': 'access',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/olx.log'),  # Путь к файлу логов
            'formatter': 'verbose',
            'level': 'DEBUG',
            'maxBytes': 10 * 1024 * 1024,  # Максимальный размер файла 10MB
            'backupCount': 10,  # Хранить 10 резервных копий
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],  # Добавлен файл в обработчики
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['warning_console', 'file'],  # Добавлен файл в обработчики
            'level': 'WARNING',
            'propagate': False,
        },
        'gunicorn.error': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'gunicorn.access': {
            'handlers': ['access_console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
