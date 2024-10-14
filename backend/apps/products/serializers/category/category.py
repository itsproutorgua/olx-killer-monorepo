from django.utils.translation import get_language
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.products.models import Category
from apps.products.serializers.category.children_category import CategoryChildrenSerializer
from apps.products.serializers.category.parent_category import ParentSerializer


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('title', 'path', 'img', 'icon', 'views', 'parent', 'children')
        read_only_fields = ('title', 'img', 'icon', 'views', 'parent', 'children')

    @extend_schema_field(ParentSerializer)
    def get_parent(self, category: Category) -> dict[str, any] | None:
        """Get parent categories using ParentSerializer."""
        if category.parent:
            return ParentSerializer(category.parent).data
        return None

    @extend_schema_field(CategoryChildrenSerializer)
    def get_children(self, category: Category) -> list[dict[str | int, any]] | None:
        """Get child categories using Category ChildrenSerializer."""
        children = category.children.all()
        return CategoryChildrenSerializer(children, many=True).data

    def to_representation(self, instance: Category) -> dict:
        """Translate the 'title' into the language used"""
        representation = super().to_representation(instance)
        language_code = get_language() or 'en'
        representation['title'] = getattr(instance, f'title_{language_code}', instance.title)
        return representation
