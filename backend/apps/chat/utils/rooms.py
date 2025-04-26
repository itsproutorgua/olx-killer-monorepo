from asgiref.sync import sync_to_async

from apps.chat.models.chat import ChatRoom


class RoomUtils:
    @staticmethod
    async def get_chat_room(room_id: int) -> int:
        return await sync_to_async(lambda: ChatRoom.objects.filter(id=room_id).first())()
