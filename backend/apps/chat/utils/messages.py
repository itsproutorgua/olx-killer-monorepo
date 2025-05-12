import json
import logging
import base64
from typing import Any, List, Optional
from django.db.models import QuerySet
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from apps.chat.models.message import Message
from apps.users.models import Profile
from apps.chat.serializers.attachment import AttachmentSerializer
from apps.chat.utils.users import UserUtils
from apps.chat.models.attachment import Attachment
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

class MessageUtils:
    @staticmethod
    async def _fetch_messages(
        queryset: QuerySet, limit: int = 50, select_related: Optional[List[str]] = None
    ) -> List[Message]:
        """Извлекает сообщения из базы данных с оптимизацией выборки."""
        try:
            if select_related:
                queryset = queryset.select_related(*select_related).prefetch_related("attachments")
            return await sync_to_async(
                lambda: list(queryset.order_by("created_at")[:limit]), thread_sensitive=True
            )()
        except Exception:
            return []

    @staticmethod
    @database_sync_to_async
    def _bulk_update_status(message_ids: List[int], status: Message.Status) -> None:
        """Обновляет статус нескольких сообщений в базе данных."""
        Message.objects.filter(id__in=message_ids).update(status=status)

    @staticmethod
    @database_sync_to_async
    def _serialize_messages(messages: List[Message]) -> List[dict]:
        """Преобразует сообщения в формат JSON, включая URL вложений из S3."""
        sender_ids = {msg.sender_id for msg in messages}
        profiles = {
            p.user_id: p.id
            for p in Profile.objects.filter(user_id__in=sender_ids).only("id", "user_id")
        }

        serialized = []
        for msg in messages:
            attachments = []
            for att in msg.attachments.all():
                attachments.append({
                    "file_url": att.file.url,  # Используем URL из S3
                    "file_name": att.file_name,
                    "content_type": att.content_type,
                })
            serialized.append({
                "text": msg.text,
                "message_id": msg.id,
                "sender_id": profiles.get(msg.sender_id),
                "status": msg.status,
                "created_at": msg.created_at.isoformat(),
                "updated_at": msg.updated_at.isoformat(),
                "attachments": attachments,
            })
        return serialized

    @staticmethod
    @database_sync_to_async
    def get_message(message_id: int) -> Optional[Message]:
        """Получает одно сообщение с вложениями из базы данных."""
        try:
            return Message.objects.select_related("sender").prefetch_related("attachments").get(id=message_id)
        except Message.DoesNotExist:
            return None

    @staticmethod
    @database_sync_to_async
    def save_message(consumer, message_text: str, file_data: Optional[dict] = None) -> Message:
        """Сохраняет сообщение с возможным вложением в S3."""
        message = Message.objects.create(
            chat_room=consumer.room,
            sender=consumer.scope["first_user"],
            text=message_text,
        )
        if file_data:
            if "data" in file_data:
                # Декодируем base64-файл
                file_name = file_data["name"]
                content_type = file_data["type"]
                file_size = file_data["size"]
                file_data_base64 = file_data["data"]
                
                # Удаляем префикс "data:image/png;base64," если есть
                if "," in file_data_base64:
                    file_data_base64 = file_data_base64.split(",")[1]
                
                try:
                    binary_data = base64.b64decode(file_data_base64)
                    attachment = Attachment(
                        message=message,
                        file_name=file_name,
                        content_type=content_type,
                        file_size=file_size
                    )
                    attachment.file.save(file_name, ContentFile(binary_data))
                    attachment.save()
                except Exception as e:
                    logger.error(f"Ошибка сохранения вложения: {str(e)}")
                    raise ValidationError(f"Failed to save attachment: {str(e)}")
            else:
                # Для обратной совместимости с action="file_uploaded"
                AttachmentSerializer.create_attachments(message, [file_data])
        return message

    @staticmethod
    async def update_message_status(message_id: int, status: Message.Status) -> bool:
        """Обновляет статус одного сообщения."""
        try:
            await MessageUtils._bulk_update_status([message_id], status)
            return True
        except Exception:
            return False

    @staticmethod
    async def chat_message(consumer, event: dict[str, Any]) -> None:
        """Обрабатывает отправку сообщения через WebSocket, включая URL вложений из S3."""
        message_id = event["message_id"]
        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(
            text_data=json.dumps(
                {"type": "chat_message", "message": message_data}, ensure_ascii=False
            )
        )
        await MessageUtils.mark_message_as_delivered(consumer, message_id)

    @staticmethod
    async def mark_message_as_delivered(consumer, message_id: int) -> None:
        """Отмечает сообщение как доставленное и обновляет статус."""
        if not await MessageUtils.update_message_status(message_id, Message.Status.DELIVERED):
            return

        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(
            text_data=json.dumps(
                {"type": "mark_message_as_delivered", "message": message_data},
                ensure_ascii=False,
            )
        )

        room = consumer.room
        recipient = await sync_to_async(room.get_recipient)(consumer.scope["first_user"])
        if recipient and await UserUtils.is_user_online(recipient):
            await MessageUtils.mark_message_as_read(consumer, message_id)

    @staticmethod
    async def mark_message_as_read(consumer, message_id: int) -> None:
        """Отмечает сообщение как прочитанное."""
        if not await MessageUtils.update_message_status(message_id, Message.Status.READ):
            return

        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(
            text_data=json.dumps(
                {"type": "mark_message_as_read", "message": message_data},
                ensure_ascii=False,
            )
        )

    @staticmethod
    async def send_last_messages(consumer) -> None:
        """Отправляет последние сообщения и обновляет статусы."""
        messages = await MessageUtils._fetch_messages(
            Message.objects.filter(chat_room=consumer.room), select_related=["sender"]
        )
        if not messages:
            await consumer.send(text_data=json.dumps([], ensure_ascii=False))
            return

        to_mark_read = [
            msg.id
            for msg in messages
            if msg.sender != consumer.scope["first_user"]
            and msg.status == Message.Status.DELIVERED
        ]

        if to_mark_read:
            await MessageUtils._bulk_update_status(to_mark_read, Message.Status.READ)
            for msg in messages:
                if msg.id in to_mark_read:
                    msg.status = Message.Status.READ

        messages_data = await MessageUtils._serialize_messages(messages)
        read_messages_data = [
            msg_data for msg_data in messages_data if msg_data["message_id"] in to_mark_read
        ]

        await consumer.send(text_data=json.dumps(messages_data, ensure_ascii=False))
        if read_messages_data:
            await consumer.channel_layer.group_send(
                consumer.chat_group_name,
                {
                    "type": "send_last_readed_messages",
                    "messages": read_messages_data,
                },
            )

    @staticmethod
    async def send_last_readed_messages(consumer, event) -> None:
        """Отправляет последние прочитанные сообщения группе."""
        await consumer.send(text_data=json.dumps(event["messages"], ensure_ascii=False))

    @staticmethod
    async def message_delete(consumer, event) -> None:
        """Удаляет сообщение и его вложения."""
        message_id = event["message_id"]
        try:
            await sync_to_async(
                lambda: Message.objects.filter(id=message_id).delete(), thread_sensitive=True
            )()
            await consumer.send(
                text_data=json.dumps({"type": "message_deleted", "message_id": message_id})
            )
        except Exception:
            pass

    @staticmethod
    async def message_edit(consumer, event) -> None:
        """Редактирует сообщение."""
        message_id, message_text = event["message_id"], event["message_text"]
        try:
            await sync_to_async(
                lambda: Message.objects.filter(id=message_id).update(text=message_text),
                thread_sensitive=True,
            )()
            await consumer.send(
                text_data=json.dumps(
                    {
                        "type": "message_edited",
                        "message_id": message_id,
                        "text": message_text,
                    },
                    ensure_ascii=False,
                )
            )
        except Exception:
            pass