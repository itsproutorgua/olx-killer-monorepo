from django.db import models
from simple_history.models import HistoricalRecords


class HistoricalModel(models.Model):
    history = HistoricalRecords(inherit=True)

    class Meta:
        abstract = True
