LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s]: %(message)s',
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
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['warning_console'],
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
