from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin


class Location(TimestampMixin, models.Model):
    LOCATION_TYPE_CHOICES = [
        ('city', _('City')),
        ('village', _('Village')),
    ]

    location_type = models.CharField(
        _('Location Type'),
        max_length=20,
        choices=LOCATION_TYPE_CHOICES,
        help_text=_('Type of location'),
    )
    city = models.ForeignKey('City', on_delete=models.CASCADE, null=True, blank=True, verbose_name=_('City'))
    village = models.ForeignKey('Village', on_delete=models.CASCADE, null=True, blank=True, verbose_name=_('Village'))
    latitude = models.DecimalField(_('Latitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    location_name = models.CharField(_('Location name'), max_length=255, blank=True, editable=False, default='-')
    region_name = models.CharField(_('Region name'), max_length=255, blank=True, editable=False, default='-')

    def __str__(self):
        if self.location_type == 'city' and self.city:
            return f'{self.city}, {self.city.region}'
        elif self.location_type == 'village' and self.village:
            return f'{self.village}, {self.village.region}'
        return str(_('Unknown Location'))

    class Meta:
        db_table = 'location'
        verbose_name = _('Location')
        verbose_name_plural = _('Locations')
        unique_together = (('latitude', 'longitude'),)

    def clean(self):
        match self.location_type:
            case 'city' if not self.city:
                raise ValidationError(_('City must be provided for city location type.'))
            case 'village' if not self.village:
                raise ValidationError(_('Village must be provided for village location type.'))

        if self.city and self.village:
            raise ValidationError(_('Location cannot be both city and village at the same time.'))

    def save(self, *args, **kwargs):
        match self.location_type:
            case 'city' if self.city:
                self.location_name = self.city.name
                self.region_name = self.city.region.name
            case 'village' if self.village:
                self.location_name = self.village.name
                self.region_name = self.village.region.name
            case _:
                self.location_name = '-'
                self.region_name = '-'

        super().save(*args, **kwargs)
