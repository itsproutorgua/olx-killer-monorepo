from rest_framework import serializers

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.users.models.profile import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'picture']


class ChatReceiveSerializer(serializers.ModelSerializer):
    first_user_profile = ProfileSerializer(source='first_user.profile', read_only=True)
    second_user_profile = ProfileSerializer(source='second_user.profile', read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['first_user_profile', 'second_user_profile', 'last_message']

    def get_last_message(self, obj):
        last_message = Message.objects.filter(chat_room=obj).order_by('-created_at').first()
        if last_message:
            return {
                'content': last_message.text,
                'created_at': last_message.created_at,
                'sender': last_message.sender.email,
            }
