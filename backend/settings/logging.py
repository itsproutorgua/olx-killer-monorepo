from pathlib import Path
from settings.base import BASE_DIR


log_dir = Path(BASE_DIR) / 'logs'
log_dir.mkdir(parents=True, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            'datefmt': '%A-%d-%B-%Y  %H:%M:%S',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'warning_console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'access_console': {
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
            'handlers': ['console', 'file'],  # Добавлен файл в обработчики
            'level': 'INFO',  # Логирование от INFO и выше
        },
        'django.request': {
            'handlers': ['warning_console', 'file'],  # Добавлен файл в обработчики
            'level': 'WARNING',  # Логирование от WARNING и выше
            'propagate': False,
        },
        'gunicorn.error': {
            'handlers': ['console', 'file'],  # Логи ошибок Gunicorn будут также записываться в файл
            'level': 'ERROR',  # Логирование от ERROR и выше
            'propagate': False,
        },
        'gunicorn.access': {
            'handlers': ['access_console', 'file'],  # Логи доступа Gunicorn будут записываться в файл
            'level': 'INFO',  # Логирование от INFO и выше
            'propagate': False,
        },
    },
}
