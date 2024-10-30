import simple_history
from modeltranslation.translator import register
from modeltranslation.translator import TranslationOptions

from apps.locations.models import City
from apps.locations.models import Region


@register(Region)
class RegionTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(City)
class CityTranslationOptions(TranslationOptions):
    fields = ('name',)


simple_history.register(Region, inherit=True)
simple_history.register(City, inherit=True)
