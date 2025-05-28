from typing import Optional

from channels.db import database_sync_to_async

from apps.chat.models.chat import ChatRoom


class RoomUtils:
    @staticmethod
    @database_sync_to_async
    def get_chat_room(room_id: int) -> Optional[ChatRoom]:
        """
        Retrieve a chat room by its ID.

        Args:
            room_id (int): The ID of the chat room to retrieve.

        Returns:
            Optional[ChatRoom]: The ChatRoom object if found, else None.
        """
        return ChatRoom.objects.filter(id=room_id).first()
