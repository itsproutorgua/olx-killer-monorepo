from rest_framework import serializers
from apps.chat.models import Attachment
import logging

logger = logging.getLogger(__name__)

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['file_name', 'file_size', 'content_type']

    @staticmethod
    def create_attachments(message, file_data_list):
        """Создаёт вложения для сообщения."""
        for file_data in file_data_list:
            try:
                attachment = Attachment(
                    message=message,
                    file_name=file_data["file_name"],
                    file_size=file_data["file_size"],
                    content_type=file_data["content_type"],
                )
                # Для обратной совместимости с action="file_uploaded"
                # Предполагается, что file_path не используется, так как файл уже сохранён
                attachment.save()
                logger.info(f"Создано вложение для сообщения {message.id}: {file_data['file_name']}")
            except Exception as e:
                logger.error(f"Ошибка создания вложения: {str(e)}")
                raise

    def create(self, validated_data):
        """Создаёт одно вложение."""
        return Attachment.objects.create(**validated_data)