from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.common.emails import send_email
from apps.users.utils.security import encode_uid


def send_email_confirmation(user_id: int) -> None:
    user = (
        get_user_model()
        .objects.only("email", "username", "first_name", "last_name")
        .get(pk=user_id)
    )
    user.last_login = timezone.now()
    user.save(update_fields=("last_login",))

    uid = encode_uid(user.pk)
    token = default_token_generator.make_token(user)

    link = urljoin(
        settings.FRONTEND_HOST,
        settings.FRONTEND_CONFIRM_EMAIL_PATH.format(uid=uid, token=token),
    )
    send_email(
        subject=_("Confirm your email address."),
        body=_(
            f"{user.first_name.title() or user.username.title()} click {link} to confirm your email address."
        ),
        to=[user.email],
        from_email=settings.DEFAULT_FROM_EMAIL,
    )
