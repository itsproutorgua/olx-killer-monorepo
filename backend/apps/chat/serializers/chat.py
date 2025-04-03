from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

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

    @extend_schema_field(
        {
            'type': 'object',
            'properties': {
                'content': {'type': 'string'},
                'created_at': {'type': 'string', 'format': 'date-time'},
                'from_this_user': {'type': 'boolean'},
            },
            'nullable': True,
        }
    )
    def get_last_message(self, obj):
        last_message = Message.objects.filter(chat_room=obj).order_by('-created_at').first()

        if not last_message:
            return None

        user_id = last_message.sender.id 

        profile_id = self.context.get('profile_id')
        sender_profile = Profile.objects.get(id=profile_id)
        sender_id = sender_profile.user.id  

        if last_message:
            return {
                'content': last_message.text,
                'created_at': last_message.created_at,
                'from_this_user': True if sender_id == user_id else False,
            }
