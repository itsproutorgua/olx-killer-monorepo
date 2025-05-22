from django.db.models import Q
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.users.models.profile import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'picture', 'username']

    def get_username(self, obj: Profile) -> str:
        return obj.user.username


class ChatReceiveSerializer(serializers.ModelSerializer):
    first_user_profile = ProfileSerializer(source='first_user.profile', read_only=True)
    second_user_profile = ProfileSerializer(source='second_user.profile', read_only=True)
    last_message = serializers.SerializerMethodField()
    room_id = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['room_id', 'first_user_profile', 'second_user_profile', 'last_message']

    @extend_schema_field({
        'type': 'object',
        'properties': {
            'content': {'type': 'string'},
            'created_at': {'type': 'string', 'format': 'date-time'},
            'from_this_user': {'type': 'boolean'},
        },
        'nullable': True,
    })
    def get_last_message(self, obj: ChatRoom) -> dict | None:
        last_message = Message.objects.filter(chat_room=obj).order_by('-created_at').first()
        if not last_message:
            return None

        profile_id = self.context.get('profile_id')
        try:
            sender_profile = Profile.objects.get(id=profile_id)
        except Profile.DoesNotExist:
            raise ValidationError(f"Profile with id {profile_id} does not exist")

        return {
            'content': last_message.text,
            'created_at': last_message.created_at,
            'from_this_user': sender_profile.user.id == last_message.sender.id,
        }

    def get_room_id(self, obj: ChatRoom) -> int:
        return obj.id


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id']

    def create(self, validated_data: dict) -> ChatRoom:
        first_profile_id = self.context.get('first_profile_id')
        second_profile_id = self.context.get('second_profile_id')

        if first_profile_id == second_profile_id:
            raise ValidationError("Profile IDs must be different")

        try:
            first_user = Profile.objects.select_related('user').get(id=first_profile_id).user
            second_user = Profile.objects.select_related('user').get(id=second_profile_id).user
        except Profile.DoesNotExist as e:
            missing_id = second_profile_id if first_profile_id else first_profile_id
            raise ValidationError(f"User with profile ID {missing_id} does not exist") from e

        room = ChatRoom.objects.filter(
            Q(first_user=first_user, second_user=second_user) |
            Q(first_user=second_user, second_user=first_user)
        ).first()

        if not room:
            room = ChatRoom.objects.create(first_user=first_user, second_user=second_user)

        return room