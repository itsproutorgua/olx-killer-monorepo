from rest_framework import serializers

from apps.products.models import Category


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title', 'created_at', 'updated_at')
