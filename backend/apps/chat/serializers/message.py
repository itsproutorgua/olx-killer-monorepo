from rest_framework import serializers
from ..models.message import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'text', 'created_at', 'sender_username']
        read_only_fields = ['id', 'created_at']