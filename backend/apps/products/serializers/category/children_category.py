from django.conf import settings
from django.utils.translation import get_language
from rest_framework import serializers

from apps.products.models import Category


class CategoryChildrenSerializer(serializers.ModelSerializer):
    products_cumulative_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ('title', 'path', 'views', 'products_cumulative_count')

    def to_representation(self, instance: Category) -> dict:
        """Translate the 'title' into the language used"""
        representation = super().to_representation(instance)
        language_code = get_language() or settings.MODELTRANSLATION_DEFAULT_LANGUAGE
        representation['title'] = getattr(instance, f'title_{language_code}', instance.title)
        return representation
