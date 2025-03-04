import logging

import requests
from authlib.jose import JoseError
from authlib.jose import JsonWebKey
from authlib.jose import jwt
from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import AuthUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


logger = logging.getLogger(__name__)


class Auth0JWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token: bytes) -> dict:
        """
        Validates the provided JWT token by fetching the JWKS and verifying the token's signature
        and claims (iss, aud, email).
        """
        jwks_url = f'https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json'

        jwks = cache.get('auth0_jwks')
        if not jwks:
            try:
                jwks = requests.get(jwks_url).json()
                cache.set('auth0_jwks', jwks, timeout=3600)
            except requests.exceptions.RequestException as e:
                logger.error(f'Failed to fetch JWKS from {jwks_url}: {str(e)}')
                raise AuthenticationFailed(_('Failed to fetch JWKS'))

        key_set = JsonWebKey.import_key_set(jwks)

        try:
            validated_token = jwt.decode(
                raw_token,
                key_set,
                claims_options={
                    'iss': {'essential': True, 'value': f'https://{settings.AUTH0_DOMAIN}/'},
                    'aud': {'essential': True, 'value': settings.AUTH0_AUDIENCE},
                },
            )
        except JoseError as e:
            logger.error(f'Failed to validate token: {str(e)}')
            raise InvalidToken(_('Token validation failed'))

        required_claims = ['email', 'iss', 'aud', 'sub', 'exp']
        for claim in required_claims:
            if claim not in validated_token:
                logger.error(f'Missing required claim: {claim}')
                raise InvalidToken(_(f'Token is missing required claim: {claim}'))

        return validated_token

    def authenticate(self, request: Request) -> tuple[AuthUser, dict] | None:
        """
        Authenticates a user using the provided token in the request header.
        """
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return None

        raw_token = self.get_raw_token(authorization_header)
        validated_token = self.get_validated_token(raw_token)

        user = self.get_user(validated_token)

        return user, validated_token

    def get_raw_token(self, authorization_header: bytes) -> bytes:
        """
        Extracts an unvalidated JSON web token from the given "Authorization" header value.
        """
        try:
            prefix, raw_token = authorization_header.split()
            if prefix.lower() != 'bearer':
                raise InvalidToken(_("Authorization header must start with 'Bearer'"))
            return raw_token
        except ValueError:
            raise InvalidToken(_('Authorization header is improperly formatted'))

    def get_user(self, validated_token: dict) -> AuthUser:
        """
        Retrieves a user from the database using the validated token's email claim.
        """
        email = validated_token.get('email')
        if not email:
            raise InvalidToken(_("Token does not contain 'email' field"))

        try:
            user = self.user_model.objects.get(email=email)
        except self.user_model.DoesNotExist:
            user = self.create_user_from_token(validated_token)

        if not user.is_active:
            message = user.history.all().values()[1].get('history_change_reason')
            if message:
                raise AuthenticationFailed(_(message), code='user_inactive')
            else:
                raise AuthenticationFailed(_('User is inactive'), code='user_inactive')

        user.last_login = now()
        user.save()

        return user

    def create_user_from_token(self, validated_token: dict) -> AuthUser:
        """
        Creates a new user based on the validated token claims.
        """
        email = validated_token.get('email')
        username = self.get_username(validated_token)
        email_verified = validated_token.get('email_verified', False)
        sub = validated_token.get('sub')

        try:
            provider_name, provider_id = sub.split('|', 1)
        except ValueError:
            logger.error(f"Invalid 'sub' format received: {sub}. Unable to split provider and user ID.")
            provider_name, provider_id = 'unknown', sub

        with transaction.atomic():
            user, created = self.user_model.objects.update_or_create(
                email=email,
                defaults={
                    'username': username,
                    'is_email_verified': email_verified,
                },
            )
            user.profile.add_provider(provider_name, provider_id)

        logger.info(f'Created new user with email: {email}')
        return user

    @staticmethod
    def get_username(data: dict) -> str:
        return data.get('given_name') or data.get('nickname', data.get('email').split('@')[0])
