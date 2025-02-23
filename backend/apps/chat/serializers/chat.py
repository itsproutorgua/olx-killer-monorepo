from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.chat.models.chat import ChatRoom


User = get_user_model()


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'first_user', 'second_user']
