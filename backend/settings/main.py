from datetime import timedelta

from corsheaders.defaults import default_headers
from corsheaders.defaults import default_methods

from settings.base import *


INSTALLED_APPS += [
    # Third-party apps
    'django_extensions',
    'rest_framework',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'rest_framework_simplejwt',
    'corsheaders',
    'rosetta',
    # Local apps
    'apps.users.apps.UsersConfig',
    'apps.products.apps.ProductsConfig',
    'apps.user_messages.apps.UserMessagesConfig',
]

MIDDLEWARE += [
    'corsheaders.middleware.CorsMiddleware',
]

# DRF
# https://www.django-rest-framework.org/
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 41,
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ('v1',),
    'DEFAULT_THROTTLE_CLASSES': ('rest_framework.throttling.UserRateThrottle',),
    'DEFAULT_THROTTLE_RATES': {'user': '1000/day'},
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
    'SWAGGER_UI_DIST': 'SIDECAR',  # shorthand to use the sidecar instead
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'CONTACT': {
        'name': 'Stanislav',
        'LinkedIn': 'https://www.linkedin.com/in/stanislav-nikitenko/',
        'telegram': 'https://t.me/F_redy',
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

# SIMPLE_JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=31),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=365),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
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


DEVELOPMENT_ENVIRONMENT = 'development'
PRODUCTION_ENVIRONMENT = 'production'

ENVIRONMENT = env('ENVIRONMENT', default=DEVELOPMENT_ENVIRONMENT)

if ENVIRONMENT == DEVELOPMENT_ENVIRONMENT:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    # Выбрать сервис для отправки email на production
    EMAIL_BACKEND = ''

# Emails
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = env('SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)

FRONTEND_HOST = env('FRONTEND_HOST', default='http://localhost:8000/')

AUTH_USER_MODEL = 'users.User'

if DEBUG:
    INSTALLED_APPS += [
        'debug_toolbar',
    ]

    MIDDLEWARE += [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]

    INTERNAL_IPS = [
        '127.0.0.1',
    ]
