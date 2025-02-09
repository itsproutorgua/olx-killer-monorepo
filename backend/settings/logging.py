import logging
import re
from pathlib import Path

from settings.base import BASE_DIR


LOG_DIR = Path(BASE_DIR) / 'logs'
LOG_DIR.mkdir(parents=True, exist_ok=True)


class IgnoreStaticRequestsFilter(logging.Filter):
    def filter(self, record):
        return 'GET /static/' not in record.getMessage()

class PlainFormatter(logging.Formatter):
    def format(self, record):
        log_message = super().format(record)

        levelname = record.levelname.ljust(8)
        log_message = log_message.replace(record.levelname, levelname)

        log_parts = log_message.split(' | ')
        if len(log_parts) > 2:
            log_parts[2] = log_parts[2].ljust(16)
            log_message = ' | '.join(log_parts)

        return log_message

class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[94m',            # Синий
        'INFO': '\033[92m',             # Зеленый
        'WARNING': '\033[93m',          # Желтый
        'ERROR': '\033[91m',            # Красный
        'CRITICAL': '\033[91m\033[1m',  # Красный жирный
        'RESET': '\033[0m',             # Сброс цвета
    }

    STATUS_COLORS = {
        '2': '\033[92m',  # Зеленый (2xx - Успех)
        '3': '\033[94m',  # Синий (3xx - Перенаправление)
        '4': '\033[93m',  # Желтый (4xx - Ошибка клиента)
        '5': '\033[91m',  # Красный (5xx - Ошибка сервера)
    }

    METHOD_COLORS = {
        'GET': '\033[94m',      # Синий
        'POST': '\033[92m',     # Зеленый
        'PUT': '\033[93m',      # Желтый
        'DELETE': '\033[91m',   # Красный
        'PATCH': '\033[95m',    # Фиолетовый
    }

    def format(self, record):
        log_message = super().format(record)

        # Уровень логирования
        levelname = record.levelname.ljust(8)
        color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        log_message = log_message.replace(record.levelname, f'{color}{levelname}{self.COLORS["RESET"]}')

        # HTTP статус-коды
        match_status = re.search(r'" (\d{3}) (\d+)$', log_message)
        if match_status:
            status_code = match_status.group(1)
            status_color = self.STATUS_COLORS.get(status_code[0], self.COLORS['RESET'])
            log_message = log_message.replace(status_code, f'{status_color}{status_code}{self.COLORS["RESET"]}')

        # HTTP методы
        match_method = re.search(r'"\s*(GET|POST|PUT|DELETE|PATCH)', log_message)
        if match_method:
            method = match_method.group(1)
            method_color = self.METHOD_COLORS.get(method, self.COLORS['RESET'])
            log_message = log_message.replace(method, f'{method_color}{method}{self.COLORS["RESET"]}')

        log_parts = log_message.split(' | ')
        if len(log_parts) > 2:
            log_parts[2] = log_parts[2].ljust(16)
            log_message = ' | '.join(log_parts)

        return log_message




LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            '()': PlainFormatter,
            'format': '%(levelname)s | %(asctime)s | %(name)s | %(message)s',
            'datefmt': '%d-%m-%Y  %H:%M:%S',
        },
        'color': {
            '()': ColoredFormatter,
            'format': '%(levelname)s | %(asctime)s | %(name)s | %(message)s',
            'datefmt': '%d-%m-%Y  %H:%M:%S',
        },
    },
    'filters': {
        'ignore_static': {
            '()': IgnoreStaticRequestsFilter,
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'color',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': LOG_DIR / 'olx.log',
            'formatter': 'verbose',
            'level': 'INFO',
            'maxBytes': 10 * 1024 * 1024,
            'backupCount': 10,
        },
    },
    'loggers': {
        'django.server': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
            'filters': ['ignore_static'],
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'gunicorn.error': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'gunicorn.access': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
            'filters': ['ignore_static'],
        },
        'django.db.backends': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'uvicorn.error': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'uvicorn.access': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
            'filters': ['ignore_static'],
        },
    },
}
