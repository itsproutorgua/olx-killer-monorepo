import simple_history
from modeltranslation.translator import register
from modeltranslation.translator import TranslationOptions

from apps.products.models import Category


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title',)
    historical = True


simple_history.register(Category, inherit=True)
