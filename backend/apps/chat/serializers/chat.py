from rest_framework import serializers

from apps.chat.models.chat import ChatRoom


class ChatReceiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'first_user', 'second_user']
