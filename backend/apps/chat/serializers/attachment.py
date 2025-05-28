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
        """Creates attachments for a message."""
        for file_data in file_data_list:
            try:
                attachment = Attachment(
                    message=message,
                    file_name=file_data["file_name"],
                    file_size=file_data["file_size"],
                    content_type=file_data["content_type"],
                )
                # For backward compatibility with action="file_uploaded"
                # It is assumed that file_path is not used, as the file is already saved
                attachment.save()
                logger.info(f"Created attachment for message {message.id}: {file_data['file_name']}")
            except Exception as e:
                logger.error(f"Error creating attachment: {str(e)}")
                raise

    def create(self, validated_data):
        """Creates a single attachment."""
        return Attachment.objects.create(**validated_data)