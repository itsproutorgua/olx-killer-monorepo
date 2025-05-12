import json
import logging
from typing import Optional
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.exceptions import ValidationError
from apps.chat.utils.messages import MessageUtils
from apps.chat.utils.rooms import RoomUtils
from apps.chat.utils.users import UserUtils
from apps.users.models import User


logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Устанавливает соединение через WebSocket."""
        try:
            query_params = self.scope.get("query_params", {})
            room_id = query_params.get("room_id", [None])[0]
            if not room_id:
                raise ValueError("Missing or invalid room_id")
            self.scope["room_id"] = room_id
        except (KeyError, IndexError):
            raise ValueError("Invalid query parameters")

        self.scope["first_user"] = await UserUtils.authenticate_user(self.scope)
        if not self.scope["first_user"]:
            raise DenyConnection(code=4001, reason="Authentication failed")

        self.room = await RoomUtils.get_chat_room(int(self.scope["room_id"]))
        if not self.room:
            raise DenyConnection(code=4004, reason="Room not found")
        self.chat_group_name = f"chat_{self.scope['room_id']}"

        if not await UserUtils.validate_user(self):
            raise DenyConnection(code=403, reason="Unauthorized user")

        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.accept("Bearer")

        await MessageUtils.send_last_messages(self)
        await UserUtils.update_user_status(self.scope["first_user"], is_online=True)

    async def disconnect(self, close_code: int) -> None:
        """Обрабатывает отключение WebSocket."""
        if hasattr(self, "chat_group_name"):
            await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

        await UserUtils.update_user_status(self.scope["first_user"], is_online=False)

    async def receive(self, text_data: str) -> None:
        """Обрабатывает входящие сообщения через WebSocket."""
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "send":
                message_text = data.get("message", "")
                file_metadata = data.get("file")

                # Сохраняем сообщение
                message = await MessageUtils.save_message(self, message_text, file_metadata)
                # Отправляем сообщение в группу
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        'type': 'chat_message',
                        'message_id': message.id,
                    },
                )

            elif action == "delete":
                message_id = data.get("message_id")
                if not message_id:
                    await self.send_error("Missing message_id")
                    return
                if await UserUtils.is_valid_sender(message_id, self.scope["first_user"]):
                    await self.channel_layer.group_send(
                        self.chat_group_name,
                        {"type": "message_delete", "message_id": message_id},
                    )
                else:
                    await self.send_error("Unauthorized to delete message")

            elif action == "edit":
                message_id = data.get("message_id")
                message_text = data.get("text")
                if not (message_id and message_text):
                    await self.send_error("Missing message_id or text")
                    return
                if await UserUtils.is_valid_sender(message_id, self.scope["first_user"]):
                    await self.channel_layer.group_send(
                        self.chat_group_name,
                        {
                            "type": "message_edit",
                            "message_id": message_id,
                            "message_text": message_text,
                        },
                    )
                else:
                    await self.send_error("Unauthorized to edit message")

        except json.JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except ValidationError as e:
            await self.send_error(f"File validation failed: {str(e)}")
        except Exception as e:
            await self.send_error(f"Error processing request: {str(e)}")

    async def send_error(self, message: str) -> None:
        """Отправляет сообщение об ошибке клиенту."""
        await self.send(text_data=json.dumps({"type": "error", "message": message}))

    async def chat_message(self, event: dict) -> None:
        """Обрабатывает событие отправки сообщения."""
        await MessageUtils.chat_message(self, event)

    async def mark_message_as_delivered(self, event: dict) -> None:
        """Обрабатывает событие доставки сообщения."""
        await MessageUtils.mark_message_as_delivered(self, event.get("message_id"))

    async def mark_message_as_read(self, event: dict) -> None:
        """Обрабатывает событие чтения сообщения."""
        await MessageUtils.mark_message_as_read(self, event.get("message_id"))

    async def send_last_readed_messages(self, event: dict) -> None:
        """Отправляет последние прочитанные сообщения."""
        await MessageUtils.send_last_readed_messages(self, event)

    async def get_recipient(self) -> Optional[User]:
        """Получает получателя для комнаты чата."""
        return await UserUtils.get_recipient(self.room, self.scope["first_user"])

    async def message_delete(self, event: dict) -> None:
        """Обрабатывает удаление сообщения."""
        await MessageUtils.message_delete(self, event)

    async def message_edit(self, event: dict) -> None:
        """Обрабатывает редактирование сообщения."""
        await MessageUtils.message_edit(self, event)