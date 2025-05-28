from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SendpulseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sendpulse'
    verbose_name = _('Sendpulse')
