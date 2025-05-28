from django.db import models
from django.utils.translation import gettext_lazy as _


class UserLeadsFromElectronInk(models.Model):
    name = models.CharField(_('name'), max_length=255)
    email = models.CharField(_('email'), max_length=255)
    text = models.TextField()

    class Meta:
        db_table = 'electron_ink_table'
        app_label = 'chat'
