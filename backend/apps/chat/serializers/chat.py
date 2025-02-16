from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.chat.models.chat import ChatRoom
from apps.chat.serializers.message import MessageSerializer


User = get_user_model()


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    users = serializers.SlugRelatedField(many=True, queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = ChatRoom
        fields = ['id', 'users', 'messages']
