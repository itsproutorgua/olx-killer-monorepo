from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed

from apps.log_config import logger


User = get_user_model()


def get_or_create_user_from_auth0(auth0_response: dict):
    email = auth0_response.get('email')
    username = auth0_response.get('nickname')
    email_verified = auth0_response.get('email_verified', False)
    picture = auth0_response.get('picture')
    sub = auth0_response.get('sub')

    if not email:
        raise AuthenticationFailed(_('Email address is required.'))
    if not sub:
        logger.error(_('Provider sub field is missing or empty.'))

    try:
        provider_name, provider_id = sub.split('|', 1)
    except ValueError:
        logger.error(f"Invalid 'sub' format received: {sub}. Unable to split provider and user ID.")
        provider_name, provider_id = 'unknown', sub

    with transaction.atomic():
        user, created = User.objects.update_or_create(
            email=email,
            defaults={
                'username': get_user_name(username),
                'picture': picture,
                'is_email_verified': email_verified,
                'last_login': now(),
            },
        )
        user.profile.add_provider(provider_name, provider_id)
        user.save()

    return {
        'created': created,
        'email': user.email,
        'username': user.username,
        'last_login': user.last_login,
    }


def get_user_name(username: str) -> str:
    if '@' in username:
        return username.split('@')[0]
    return username
