from datetime import timedelta
from logging import config as logging_config

from corsheaders.defaults import default_headers
from corsheaders.defaults import default_methods

from apps.products.utils import CurrencyEnum
from settings.base import *
from settings.jazzmin import *
from settings.logging import LOGGING


logging_config.dictConfig(LOGGING)


DEVELOPMENT_ENVIRONMENT = 'development'
PRODUCTION_ENVIRONMENT = 'production'

ENVIRONMENT = env('ENVIRONMENT', default=DEVELOPMENT_ENVIRONMENT)

DATA_UPLOAD_MAX_MEMORY_SIZE = env('DATA_UPLOAD_MAX_MEMORY_SIZE')
FILE_UPLOAD_MAX_MEMORY_SIZE = env('FILE_UPLOAD_MAX_MEMORY_SIZE')
DYNAMIC_THROTTLE_RATE = env('DYNAMIC_THROTTLE_RATE', default='7/second')

CATEGORY_TREE_CACHE_TIMEOUT = env('CATEGORY_TREE_CACHE_TIMEOUT')

# User Validators
MIN_LENGTH_FIRST_NAME = 3
MAX_LENGTH_FIRST_NAME = 20
MIN_LENGTH_LAST_NAME = 3
MAX_LENGTH_LAST_NAME = 20

# Phone Validators
MIN_PHONE_NUMBER_LENGTH = 10
MAX_PHONE_NUMBER_LENGTH = 15

# Product Validators
MIN_LENGTH_DESCRIPTION = 10
MAX_LENGTH_DESCRIPTION = 10000
MIN_LENGTH_TITLE = 3
MAX_LENGTH_TITLE = 150
# Video
VIDEO_UPLOAD_LIMIT = env('VIDEO_UPLOAD_LIMIT')
MAX_VIDEO_FILE_SIZE_MB = env('MAX_VIDEO_FILE_SIZE_MB')
ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
ALLOWED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/x-m4v',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/wmv',
    'video/x-flv',
    'video/flv',
    'video/x-matroska',
    'video/mkv',
    'video/webm',
    'video/ogg',
]
# Photo
MAX_IMAGE_FILE_SIZE_MB = env('MAX_IMAGE_FILE_SIZE_MB')
MAX_COUNT_IMAGE_FILES = 8
DEFAULT_CURRENCY = CurrencyEnum.UAH.value['code']

FRONTEND_HOST = env('FRONTEND_HOST', default='http://localhost:5173')

INSTALLED_APPS += [
    # Third-party apps
    'django_extensions',
    'rest_framework',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'rest_framework_simplejwt',
    'corsheaders',
    'rosetta',
    'simple_history',
    'channels',
    # Local apps
    'apps.users.apps.UsersConfig',
    'apps.products.apps.ProductsConfig',
    'apps.locations.apps.LocationsConfig',
    'apps.favorites.apps.FavoritesConfig',
    'apps.common',
    'apps.chat.apps.ChatConfig',
]

MIDDLEWARE += [
    'simple_history.middleware.HistoryRequestMiddleware',
    'csp.middleware.CSPMiddleware',
]

# DRF
# https://www.django-rest-framework.org/
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.users.authentication.Auth0JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 41,
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ('v1',),
    'DEFAULT_THROTTLE_CLASSES': ('rest_framework.throttling.UserRateThrottle',),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '200/day',
        'user': '1000000000/day',
    },
}

# Auth0
AUTH0_DOMAIN = env('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = env('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = env('AUTH0_CLIENT_SECRET')
AUTH0_AUDIENCE = env('AUTH0_AUDIENCE')

# SPECTACULAR
# https://drf-spectacular.readthedocs.io/en/latest/readme.html
SPECTACULAR_SETTINGS = {
    'TITLE': 'OLX-Killer API',
    'DESCRIPTION': 'DRF OLX-Killer',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SWAGGER_UI_DIST': 'SIDECAR',  # shorthand to use the sidecar instead
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'CONTACT': {
        'name': 'Stanislav',
        'LinkedIn': 'https://www.linkedin.com/in/stanislav-nikitenko/',
        'telegram': 'https://t.me/F_redy',
    },
    'SECURITY': [{'Auth0JWT': []}],
}

# Django Channels
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [os.environ.get('REDIS_URL', ('127.0.0.1', 6379))],
        },
    },
}

# CORS headers
# https://pypi.org/project/django-cors-headers/

CORS_ALLOW_CREDENTIALS = env('CORS_ALLOW_CREDENTIALS', default=False)
CORS_ALLOW_METHODS = [
    *default_methods,
]
CORS_ALLOW_HEADERS = [
    *default_headers,
]
CORS_ALLOWED_ORIGINS = env('CORS_ALLOWED_ORIGINS', default='http://localhost:8000').split()
CSRF_TRUSTED_ORIGINS = env('CSRF_TRUSTED_ORIGINS', default='http://localhost:8000').split()


if ENVIRONMENT != DEVELOPMENT_ENVIRONMENT:
    # COOKIE
    SESSION_COOKIE_DOMAIN = env('SESSION_COOKIE_DOMAIN')
    CSRF_COOKIE_DOMAIN = env('CSRF_COOKIE_DOMAIN')
    SESSION_COOKIE_SAMESITE = env('SESSION_COOKIE_SAMESITE')
    # SECURE
    SECURE_COOKIES = env('SECURE_COOKIES')
    SECURE_SSL_REDIRECT = env('SECURE_SSL_REDIRECT')
    SECURE_HSTS_SECONDS = env('SECURE_HSTS_SECONDS')
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env('SECURE_HSTS_INCLUDE_SUBDOMAINS')
    SECURE_HSTS_PRELOAD = env('SECURE_HSTS_PRELOAD')
    SECURE_PROXY_SSL_HEADER = env('SECURE_PROXY_SSL_HEADER').split()
    # SSL
    SESSION_COOKIE_SECURE = env('SESSION_COOKIE_SECURE')
    CSRF_COOKIE_SECURE = env('CSRF_COOKIE_SECURE')
else:
    SECURE_COOKIES = env('SECURE_COOKIES', default=False)
    SECURE_SSL_REDIRECT = env('SECURE_SSL_REDIRECT', default=False)
    SECURE_HSTS_SECONDS = env('SECURE_HSTS_SECONDS', default=0)
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env('SECURE_HSTS_INCLUDE_SUBDOMAINS', default=False)
    SECURE_HSTS_PRELOAD = env('SECURE_HSTS_PRELOAD', default=False)


# CSP
CSP_DEFAULT_SRC = ["'self'"]
CSP_SCRIPT_SRC = [
    "'self'",
    "'unsafe-inline'",
    'cdnjs.cloudflare.com',
    'unpkg.com',
]
CSP_STYLE_SRC = [
    "'self'",
    "'unsafe-inline'",
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'unpkg.com',
]
CSP_FONT_SRC = [
    "'self'",
    'fonts.gstatic.com',
]
CSP_WORKER_SRC = ["'self'", 'blob:']
CSP_IMG_SRC = ["'self'", 'data:', 'https://*.s3.amazonaws.com']
CSP_MEDIA_SRC = ["'self'", 'https://*.s3.amazonaws.com']
CSP_CONNECT_SRC = ["'self'", 'https://*.s3.amazonaws.com', FRONTEND_HOST]
CSP_FRAME_ANCESTORS = ("'self'", FRONTEND_HOST)

# SIMPLE_JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=31),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=365),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'RS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': AUTH0_AUDIENCE,
    'ISSUER': f'https://{AUTH0_DOMAIN}/',
    'JWK_URL': f'https://{AUTH0_DOMAIN}/.well-known/jwks.json',
    'LEEWAY': 0,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'email',
    'USER_ID_CLAIM': 'email',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

if ENVIRONMENT == DEVELOPMENT_ENVIRONMENT:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    # Выбрать сервис для отправки email на production
    EMAIL_BACKEND = ''

# Emails
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = env('SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)

SUPER_LOGIN = env('SUPER_LOGIN')
SUPER_PASSWORD = env('SUPER_PASSWORD')

AUTH_USER_MODEL = 'users.User'

# Redis
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/')
REDIS_CACHE_URL = f'{REDIS_URL}/1'


# Celery
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = None
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']

#  CACHES
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_CACHE_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT': 300,
    }
}

# AWS S3
AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID', default=None)
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY', default=None)
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME', default=None)
AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME', default='us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

# Настройка хранилищ
STORAGES = {
    'default': {
        'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
        'OPTIONS': {
            'access_key': AWS_ACCESS_KEY_ID,
            'secret_key': AWS_SECRET_ACCESS_KEY,
            'bucket_name': AWS_STORAGE_BUCKET_NAME,
            'custom_domain': AWS_S3_CUSTOM_DOMAIN,
        },
    },
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
}

# Для хранения медиафайлов
DEFAULT_FILE_STORAGE = 'storages.backends.s3.S3Boto3Storage'
DEFAULT_PRODUCT_IMAGE = 'examples/product_empty_image.jpg'

if DEBUG:
    INSTALLED_APPS += [
        'debug_toolbar',
    ]

    MIDDLEWARE += [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]

    INTERNAL_IPS = [
        '127.0.0.1',
        'localhost',
        '0.0.0.0',
        '172.17.0.1',
    ]
