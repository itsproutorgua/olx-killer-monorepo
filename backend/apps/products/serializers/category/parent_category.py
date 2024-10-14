from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.products.models import Category


class ParentSerializer(serializers.ModelSerializer):
    parent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('title', 'path', 'views', 'parent')

    @extend_schema_field(serializers.DictField)
    def get_parent(self, category: Category) -> dict | None:
        if category.parent:
            return ParentSerializer(category.parent).data
        return None
