from django.db import models
from simple_history.models import HistoricalRecords


class HistoricalModel(models.Model):
    history = HistoricalRecords(inherit=True, cascade_delete_history=True)

    class Meta:
        abstract = True
