from django.conf import settings
from django.utils.translation import get_language
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.log_config import logger
from apps.products.models import Category
from apps.products.models import Product
from apps.products.serializers.category.children_category import CategoryChildrenSerializer
from apps.products.serializers.category.parent_category import ParentSerializer


class CategorySerializer(serializers.ModelSerializer):
    img_url = serializers.ImageField(source='img', read_only=True)
    icon_url = serializers.ImageField(source='icon', read_only=True)
    parent = serializers.SerializerMethodField(read_only=True)
    children = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = ('title', 'path', 'views', 'img_url', 'icon_url', 'parent', 'children')
        read_only_fields = ('title', 'views')

    @extend_schema_field(ParentSerializer)
    def get_parent(self, category: Category) -> dict[str, any] | None:
        """Get parent categories using ParentSerializer."""
        if parent := category.parent:
            return ParentSerializer(parent).data
        return None

    @extend_schema_field(CategoryChildrenSerializer)
    def get_children(self, category: Category) -> list[dict[str | int, any]] | list:
        """
        Retrieves child categories with an additional cumulative count of products.
        Dependencies:
        - django-mptt: For handling hierarchical data models and methods like
          `add_related_count`.
        """
        if children := category.children.all():
            try:
                annotated_categories = Category.objects.add_related_count(
                    children,
                    Product,
                    'category',
                    'products_cumulative_count',
                    cumulative=True,
                )
                return CategoryChildrenSerializer(annotated_categories, many=True).data
            except AttributeError as e:
                logger.error(e)
                return CategoryChildrenSerializer(children, many=True).data

        return CategoryChildrenSerializer([], many=True).data

    def to_representation(self, instance: Category) -> dict:
        """Translate the 'title' into the language used"""
        representation = super().to_representation(instance)
        language_code = get_language() or settings.MODELTRANSLATION_DEFAULT_LANGUAGE
        representation['title'] = getattr(instance, f'title_{language_code}', instance.title)
        return representation
