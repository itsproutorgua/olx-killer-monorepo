from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.products.models import Product
from apps.products.models import ProductVideo


class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ['id', 'video']
        read_only_fields = ['id']

    @staticmethod
    def validate_video(value: UploadedFile) -> UploadedFile:
        """Validate the uploaded video file."""
        mime_type = value.content_type
        allowed_mime_types = ProductVideo.ALLOWED_MIME_TYPES

        if mime_type not in allowed_mime_types:
            raise serializers.ValidationError(_('Invalid file type. Allowed types: %s') % ', '.join(allowed_mime_types))

        max_file_size_mb = ProductVideo.MAX_FILE_SIZE_MB
        if value.size > max_file_size_mb * 1024 * 1024:
            raise serializers.ValidationError(_('The video size cannot exceed %s MB.') % max_file_size_mb)

        return value

    def validate(self, attrs: dict) -> dict:
        """Validate the attributes for the product video."""
        product = self.context.get('product')
        if product is None:
            raise serializers.ValidationError(_('Product must be provided.'))

        if ProductVideo.objects.filter(product=product).exists():
            raise serializers.ValidationError(_('Each product can have only one video.'))

        return attrs

    @classmethod
    def create_video(cls, product: Product, video_file: UploadedFile | None) -> ProductVideo | None:
        """Create or replace a product video."""
        if video_file is None:
            return None

        ProductVideo.objects.filter(product=product).delete()

        cls.validate_video(video_file)
        validated_data = {'product': product, 'video': video_file}
        return cls().create(validated_data)

    def create(self, validated_data: dict) -> ProductVideo:
        try:
            return ProductVideo.objects.create(**validated_data)
        except IntegrityError as e:
            raise ValidationError(_('Failed to create video: %s') % str(e))

    def update(self, instance: ProductVideo, validated_data: dict) -> ProductVideo:
        """Update the product video."""
        instance.video = validated_data.get('video', instance.video)

        try:
            instance.save()
        except IntegrityError as e:
            raise ValidationError(_('Failed to update video: %s') % str(e))

        return instance
