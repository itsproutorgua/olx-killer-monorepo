from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from apps.common import errors
from apps.products.models.deactivate_feedback import ProductDeactivationFeedback
from apps.products.models.product import Product


class DeactivatedProductFeedbackSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    answer = serializers.ChoiceField(choices=ProductDeactivationFeedback.AnswerStatus.choices)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ProductDeactivationFeedback
        fields = ['id', 'product', 'answer', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        product = data.get('product')
        user = self.context['request'].user

        if product.seller != user:
            raise PermissionDenied(errors.FEEDBACK_PERMISSION_ERROR)

        return data
