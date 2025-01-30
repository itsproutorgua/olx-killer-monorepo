from rest_framework import serializers
from ..models.chat import ChatRoom
from ..serializers.message import MessageSerializer


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'users', 'messages']