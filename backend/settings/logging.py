import logging
import re
from pathlib import Path

from settings.base import BASE_DIR


LOG_DIR = Path(BASE_DIR) / 'logs'
LOG_DIR.mkdir(parents=True, exist_ok=True)

LEVEL_LENGTH = 8
NAME_LENGTH = 16
OUTPUT_FORMAT = '%(asctime)s | %(name)s | %(levelname)s | %(message)s'
DATE_FORMAT = '%d-%m-%Y  %H:%M:%S'


class IgnoreStaticRequestsFilter(logging.Filter):
    def filter(self, record):
        return 'GET /static/' not in record.getMessage()


class BaseFormatter(logging.Formatter):
    def format(self, record):
        log_message = super().format(record)

        # Выравнивание уровня логирования
        levelname = record.levelname.ljust(LEVEL_LENGTH)
        log_message = log_message.replace(record.levelname, levelname)

        # Выравнивание имени логгера
        log_parts = log_message.split(' | ')
        if len(log_parts) > 2:
            log_parts[1] = log_parts[1].ljust(NAME_LENGTH)
            log_message = ' | '.join(log_parts)

        return log_message


class ColoredFormatter(BaseFormatter):
    COLORS = {
        'DEBUG': '\033[94m',  # Синий
        'INFO': '\033[92m',  # Зеленый
        'WARNING': '\033[93m',  # Желтый
        'ERROR': '\033[91m',  # Красный
        'CRITICAL': '\033[91m\033[1m',  # Красный жирный
        'RESET': '\033[0m',  # Сброс цвета
    }

    STATUS_COLORS = {
        '2': '\033[92m',  # Зеленый (2xx - Успех)
        '3': '\033[94m',  # Синий (3xx - Перенаправление)
        '4': '\033[93m',  # Желтый (4xx - Ошибка клиента)
        '5': '\033[91m',  # Красный (5xx - Ошибка сервера)
    }

    METHOD_COLORS = {
        'GET': '\033[94m',  # Синий
        'POST': '\033[92m',  # Зеленый
        'PUT': '\033[93m',  # Желтый
        'DELETE': '\033[91m',  # Красный
        'PATCH': '\033[95m',  # Фиолетовый
    }

    def format(self, record):
        log_message = super().format(record)

        # Раскрашивание уровня логирования
        color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        log_message = log_message.replace(record.levelname, f'{color}{record.levelname}{self.COLORS["RESET"]}')

        # Раскрашивание HTTP статус-кода
        match_status = re.search(r'"\s(\d{3})\s', log_message)
        if match_status:
            status_code = match_status.group(1)
            status_color = self.STATUS_COLORS.get(status_code[0], self.COLORS['RESET'])
            log_message = log_message.replace(status_code, f'{status_color}{status_code}{self.COLORS["RESET"]}')

        # Раскрашивание HTTP метода
        match_method = re.search(r'"\s*(GET|POST|PUT|DELETE|PATCH)', log_message)
        if match_method:
            method = match_method.group(1)
            method_color = self.METHOD_COLORS.get(method, self.COLORS['RESET'])
            log_message = log_message.replace(method, f'{method_color}{method}{self.COLORS["RESET"]}')

        return log_message


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            '()': BaseFormatter,
            'format': OUTPUT_FORMAT,
            'datefmt': DATE_FORMAT,
        },
        'color': {
            '()': ColoredFormatter,
            'format': OUTPUT_FORMAT,
            'datefmt': DATE_FORMAT,
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
        # logger_name: {
        #     'handlers': ['console', 'file'],
        #     'level': 'WARNING',
        #     'propagate': False,
        #     'filters': ['ignore_static'],
        # } for logger_name in (
        #     'django',
        #     'django.server',
        #     'gunicorn.access',
        #     'gunicorn.error',
        #     'django.db.backends',
        #     'uvicorn.access',
        #     'uvicorn.error',
        #     )
        'django.server': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'gunicorn.error': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': True,
        },
        'gunicorn.access': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
            'filters': ['ignore_static'],
        },
        'django.db.backends': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        # 'uvicorn.error': {
        #     'handlers': ['console', 'file'],
        #     'level': 'ERROR',
        #     'propagate': False,
        # },
        # 'uvicorn.access': {
        #     'handlers': ['console', 'file'],
        #     'level': 'INFO',
        #     'propagate': False,
        #     'filters': ['ignore_static'],
        # },
        'daphne': {  
            'handlers': ['console', 'file'],
            'level': 'INFO',  
            'propagate': False,
        },
        'daphne.access': {  
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'daphne.error': {  #
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}
