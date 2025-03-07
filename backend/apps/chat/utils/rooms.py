from asgiref.sync import sync_to_async
from django.db.models import Q

from apps.chat.models.chat import ChatRoom
from apps.users.models import User


class RoomUtils:
    @staticmethod
    async def get_chat_room(room_id: int) -> int:
        return await sync_to_async(lambda: ChatRoom.objects.filter(id=room_id).first())()

    @staticmethod
    async def create_or_get_room(first_user_email: str, second_user_id: int) -> int:
        first_user = await sync_to_async(lambda: User.objects.get(email=first_user_email))()
        second_user = await sync_to_async(lambda: User.objects.get(id=second_user_id))()

        room = await sync_to_async(
            lambda: ChatRoom.objects.filter(
                Q(first_user=first_user, second_user=second_user) | Q(first_user=second_user, second_user=first_user)
            ).first()
        )()

        if room:
            return room.id

        room = await sync_to_async(lambda: ChatRoom.objects.create(first_user=first_user, second_user=second_user))()

        return room.id
