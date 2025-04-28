from django.db.models import Q
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.users.models.profile import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'picture']


class ChatReceiveSerializer(serializers.ModelSerializer):
    first_user_profile = ProfileSerializer(source='first_user.profile')
    second_user_profile = ProfileSerializer(source='second_user.profile')
    last_message = serializers.SerializerMethodField(method_name='get_last_message')
    room_id = serializers.SerializerMethodField(method_name='get_room_id')

    class Meta:
        model = ChatRoom
        fields = ['room_id', 'first_user_profile', 'second_user_profile', 'last_message']

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
        
    def get_room_id(self, obj):
        return obj.id


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id']

    def create(self, validated_data):
        first_profile_id = self.context.get('first_profile_id')
        second_profile_id = self.context.get('second_profile_id')

        print(self.context)

        if first_profile_id == second_profile_id:
            return serializers.ValidationError('Profile ids must be different')

        first_user = Profile.objects.select_related('user').get(id=first_profile_id).user
        second_user = Profile.objects.select_related('user').get(id=second_profile_id).user

        if not first_user or not second_user:
            return serializers.ValidationError(
                f'User with profile id {second_profile_id if first_user else first_profile_id} does not exist'
            )

        room = ChatRoom.objects.filter(
            Q(first_user=first_user, second_user=second_user) | Q(second_user=first_user, first_user=second_user)
        ).first()

        if not room:
            room, created = ChatRoom.objects.get_or_create(first_user=first_user, second_user=second_user)

        return room
