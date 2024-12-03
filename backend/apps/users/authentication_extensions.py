from drf_spectacular.extensions import OpenApiAuthenticationExtension
from django.utils.translation import gettext_lazy as _


class Auth0JWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = 'apps.users.authentication.Auth0JWTAuthentication'
    name = 'Auth0JWT'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
            'description': _('JWT authentication via Auth0'),
        }
