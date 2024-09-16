from django.utils.translation import get_language
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.products.models import Category
from apps.products.serializers.parent_category import ParentSerializer


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'title', 'parent', 'img', 'created_at', 'updated_at')
        read_only_fields = ('img', 'created_at', 'updated_at')

    @extend_schema_field(ParentSerializer)
    def get_parent(self, category: Category) -> dict[str, any] | None:
        if category.parent:
            return ParentSerializer(category.parent).data
        return None

    def to_representation(self, instance):
        """Переводим title на используемый язык"""
        representation = super().to_representation(instance)
        language_code = get_language() or 'en'
        representation['title'] = getattr(instance, f'title_{language_code}', instance.title)
        return representation
