from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UserMessagesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.user_messages"
    verbose_name = _("User messages")
