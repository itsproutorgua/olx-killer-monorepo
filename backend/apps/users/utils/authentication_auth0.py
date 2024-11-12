from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from apps.log_config import logger


User = get_user_model()


def get_or_create_user_from_auth0(auth0_response: dict):
    email = auth0_response.get('email')
    username = auth0_response.get('nickname')
    email_verified = auth0_response.get('email_verified')
    picture = auth0_response.get('picture')
    sub = auth0_response.get('sub')

    if not email:
        raise AuthenticationFailed(_('Email address is required.'))
    if not email_verified:
        raise AuthenticationFailed(_('Email verified is required!'))
    if not sub:
        raise AuthenticationFailed(_('Provider sub field is missing or empty.'))

    try:
        provider_name, provider_id = sub.split('|', 1)
    except ValueError:
        logger.error(f"Invalid 'sub' format received: {sub}. Unable to split provider and user ID.")
        provider_name, provider_id = 'unknown', sub

    user, created = User.objects.get_or_create(email=email)
    user.profile.add_provider(provider_name, provider_id)

    if created:
        user.username = get_user_name(username)
        user.email_verified = email_verified
        user.picture = picture
        user.save()

    tokens = get_jwt_tokens(user)

    return {
        'created': created,
        'email': user.email,
        'username': user.username,
        'tokens': tokens,
    }


def get_user_name(username: str) -> str:
    if '@' in username:
        return username.split('@')[0]
    return username


def get_jwt_tokens(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
