from pathlib import Path

from settings.base import BASE_DIR


log_dir = Path(BASE_DIR) / 'logs'
log_dir.mkdir(parents=True, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s | %(levelname)s | %(name)s  | %(message)s',
            'datefmt': '%d-%m-%Y  %H:%M:%S',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': log_dir / 'olx.log',  # Путь к файлу логов
            'formatter': 'verbose',
            'level': 'DEBUG',  # Все логи начиная с DEBUG
            'maxBytes': 10 * 1024 * 1024,  # Максимальный размер файла 10MB
            'backupCount': 10,  # Хранить 10 резервных копий
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],  # Логи Django в консоль и файл
            'level': 'INFO',  # Логирование всех сообщений в консоль
        },
        'django.request': {
            'handlers': ['console', 'file'],  # Логирование запросов Django в консоль и файл
            'level': 'INFO',  # Логирование всех сообщений в консоль
            'propagate': False,
        },
        'gunicorn.error': {
            'handlers': ['file'],  # Логи ошибок Gunicorn записываются только в файл
            'level': 'ERROR',  # Логирование только ошибок в файл
            'propagate': False,
        },
        'gunicorn.access': {
            'handlers': ['console'],  # Логи запросов Gunicorn будут записываться только в консоль
            'level': 'INFO',  # Логирование всех запросов в консоль
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console', 'file'],  # Логируем SQL-запросы в консоль и файл
            'level': 'WARNING',  # Логируем все запросы
            'propagate': False,
        },
    },
}
