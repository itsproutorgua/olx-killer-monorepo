import base64
import json
import logging
from typing import Any
from typing import List
from typing import Optional

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db.models import QuerySet

from apps.chat.models.attachment import Attachment
from apps.chat.models.message import Message
from apps.chat.serializers.attachment import AttachmentSerializer
from apps.chat.utils.notification import Notification
from apps.chat.utils.users import UserUtils
from apps.users.models import Profile


# Set up logging for the module
logger = logging.getLogger(__name__)


class MessageUtils:
    @staticmethod
    async def _fetch_messages(
        queryset: QuerySet, limit: int = 50, select_related: Optional[List[str]] = None
    ) -> List[Message]:
        """
        Fetches messages from the database with optimized query performance.

        Args:
            queryset (QuerySet): The queryset of messages to fetch.
            limit (int): The maximum number of messages to return (default: 50).
            select_related (Optional[List[str]]): Fields to include in select_related for query optimization.

        Returns:
            List[Message]: A list of Message objects.
        """
        try:
            if select_related:
                # Optimize the query by selecting related fields and prefetching attachments
                queryset = queryset.select_related(*select_related).prefetch_related('attachments')
            # Fetch messages ordered by creation time, limited to the specified number
            return await sync_to_async(
                lambda: list(queryset.order_by('-created_at')[:limit][::-1]), thread_sensitive=True
            )()
        except Exception:
            # Return an empty list if an error occurs
            return []

    @staticmethod
    @database_sync_to_async
    def _bulk_update_status(message_ids: List[int], status: Message.Status) -> None:
        """
        Updates the status of multiple messages in the database.

        Args:
            message_ids (List[int]): List of message IDs to update.
            status (Message.Status): The new status to apply.
        """
        Message.objects.filter(id__in=message_ids).update(status=status)

    @staticmethod
    @database_sync_to_async
    def _serialize_messages(messages: List[Message]) -> List[dict]:
        """
        Serializes a list of messages into a JSON-compatible format, including S3 attachment URLs.

        Args:
            messages (List[Message]): List of Message objects to serialize.

        Returns:
            List[dict]: A list of dictionaries containing serialized message data.
        """
        # Collect unique sender IDs from the messages
        sender_ids = {msg.sender_id for msg in messages}
        # Fetch profile IDs for the senders to map to user IDs
        profiles = {p.user_id: p.id for p in Profile.objects.filter(user_id__in=sender_ids).only('id', 'user_id')}

        serialized = []
        for msg in messages:
            # Serialize attachments for each message
            attachments = []
            for att in msg.attachments.all():
                attachments.append(
                    {
                        'iphenyl_url': att.file.url,  # Use the S3 URL for the attachment
                        'file_name': att.file_name,
                        'content_type': att.content_type,
                    }
                )
            # Append serialized message data
            serialized.append(
                {
                    'text': msg.text,
                    'message_id': msg.id,
                    'sender_id': profiles.get(msg.sender_id),
                    'status': msg.status,
                    'created_at': msg.created_at.isoformat(),
                    'updated_at': msg.updated_at.isoformat(),
                    'attachments': attachments,
                    'room_id': msg.chat_room.id,
                }
            )
        return serialized

    @staticmethod
    @database_sync_to_async
    def get_message(message_id: int) -> Optional[Message]:
        """
        Retrieves a single message with its attachments from the database.

        Args:
            message_id (int): The ID of the message to retrieve.

        Returns:
            Optional[Message]: The Message object if found, otherwise None.
        """
        try:
            return Message.objects.select_related('sender').prefetch_related('attachments').get(id=message_id)
        except Message.DoesNotExist:
            return None

    @staticmethod
    @database_sync_to_async
    def save_message(consumer, message_text: str, file_data: Optional[dict] = None) -> Message:
        """
        Saves a message to the database, optionally with an attachment stored in S3.

        Args:
            consumer: The WebSocket consumer instance.
            message_text (str): The text content of the message.
            file_data (Optional[dict]): Metadata for an attachment, if provided.

        Returns:
            Message: The saved Message object.

        Raises:
            ValidationError: If attachment saving fails.
        """
        # Create a new message in the database
        message = Message.objects.create(
            chat_room=consumer.room,
            sender=consumer.scope['first_user'],
            text=message_text,
        )
        if file_data:
            if 'data' in file_data:
                # Decode base64-encoded file data
                file_name = file_data['name']
                content_type = file_data['type']
                file_size = file_data['size']
                file_data_base64 = file_data['data']

                # Remove the data URI prefix (e.g., "data:image/png;base64,") if present
                if ',' in file_data_base64:
                    file_data_base64 = file_data_base64.split(',')[1]

                try:
                    # Decode base64 data to binary
                    binary_data = base64.b64decode(file_data_base64)
                    attachment = Attachment(
                        message=message, file_name=file_name, content_type=content_type, file_size=file_size
                    )
                    # Save the attachment file to S3
                    attachment.file.save(file_name, ContentFile(binary_data))
                    attachment.save()
                except Exception as e:
                    # Log and raise an error if attachment saving fails
                    logger.error(f'Error saving attachment: {str(e)}')
                    raise ValidationError(f'Failed to save attachment: {str(e)}')
            else:
                # For backward compatibility with action="file_uploaded"
                AttachmentSerializer.create_attachments(message, [file_data])
        return message

    @staticmethod
    async def update_message_status(message_id: int, status: Message.Status) -> bool:
        """
        Updates the status of a single message.

        Args:
            message_id (int): The ID of the message to update.
            status (Message.Status): The new status to apply.

        Returns:
            bool: True if the update was successful, False otherwise.
        """
        try:
            await MessageUtils._bulk_update_status([message_id], status)
            return True
        except Exception:
            return False

    @staticmethod
    async def chat_message(consumer, event: dict[str, Any]) -> None:
        """
        Processes the sending of a chat message via WebSocket, including S3 attachment URLs.

        Args:
            consumer: The WebSocket consumer instance.
            event (dict[str, Any]): The event data containing the message ID.
        """
        message_id = event['message_id']
        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        # Serialize the message and send it to the client
        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(text_data=json.dumps({'type': 'chat_message', 'message': message_data}, ensure_ascii=False))
        # Mark the message as delivered
        await MessageUtils.mark_message_as_delivered(consumer, message_id)

    @staticmethod
    async def mark_message_as_delivered(consumer, message_id: int) -> None:
        """
        Marks a message as delivered and updates its status.

        Args:
            consumer: The WebSocket consumer instance.
            message_id (int): The ID of the message to mark as delivered.
        """
        if not await MessageUtils.update_message_status(message_id, Message.Status.DELIVERED):
            return

        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        # Send the updated message status to the client
        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(
            text_data=json.dumps(
                {'type': 'mark_message_as_delivered', 'message': message_data},
                ensure_ascii=False,
            )
        )

        room = consumer.room
        recipient = await sync_to_async(room.get_recipient)(consumer.scope['first_user'])

        if message.sender and message.sender != consumer.scope['first_user']:
            notification_group_name = f'notifications_{consumer.scope["first_user"].id}'

            data = await Notification._get_msg_data(consumer.scope['first_user'])

            await consumer.channel_layer.group_send(notification_group_name, {'type': 'notify', 'data': data})

        # Check if the recipient is online and mark the message as read if applicable
        if recipient and await UserUtils.is_user_online(recipient):
            await MessageUtils.mark_message_as_read(consumer, message_id)

    @staticmethod
    async def mark_message_as_read(consumer, message_id: int) -> None:
        """
        Marks a message as read.

        Args:
            consumer: The WebSocket consumer instance.
            message_id (int): The ID of the message to mark as read.
        """
        if not await MessageUtils.update_message_status(message_id, Message.Status.READ):
            return

        message = await MessageUtils.get_message(message_id)
        if not message:
            return

        # Send the updated message status to the client
        message_data = (await MessageUtils._serialize_messages([message]))[0]
        await consumer.send(
            text_data=json.dumps(
                {'type': 'mark_message_as_read', 'message': message_data},
                ensure_ascii=False,
            )
        )

        if message.sender and message.sender != consumer.scope['first_user']:
            notification_group_name = f'notifications_{consumer.scope["first_user"].id}'

            data = await Notification._get_msg_data(consumer.scope['first_user'])

            print(consumer.scope['first_user'])

            await consumer.channel_layer.group_send(notification_group_name, {'type': 'notify', 'data': data})

    @staticmethod
    async def send_last_messages(consumer) -> None:
        """
        Sends the last messages in a room and updates their statuses.

        Args:
            consumer: The WebSocket consumer instance.
        """
        # Fetch the latest messages for the room
        messages = await MessageUtils._fetch_messages(
            Message.objects.filter(chat_room=consumer.room), select_related=['sender']
        )
        if not messages:
            # Send an empty list if no messages are found
            await consumer.send(text_data=json.dumps([], ensure_ascii=False))
            return

        # Identify messages to mark as read (those not sent by the current user and delivered)
        to_mark_read = [
            msg.id
            for msg in messages
            if msg.sender != consumer.scope['first_user'] and msg.status == Message.Status.DELIVERED
        ]

        if to_mark_read:
            # Update the status of messages to read
            await MessageUtils._bulk_update_status(to_mark_read, Message.Status.READ)
            for msg in messages:
                if msg.id in to_mark_read:
                    msg.status = Message.Status.READ

        # Serialize and send the messages to the client
        messages_data = await MessageUtils._serialize_messages(messages)
        read_messages_data = [msg_data for msg_data in messages_data if msg_data['message_id'] in to_mark_read]

        await consumer.send(text_data=json.dumps(messages_data, ensure_ascii=False))
        if read_messages_data:
            # Notify the group about the newly read messages
            await consumer.channel_layer.group_send(
                consumer.chat_group_name,
                {
                    'type': 'send_last_readed_messages',
                    'messages': read_messages_data,
                },
            )

    @staticmethod
    async def send_last_readed_messages(consumer, event) -> None:
        """
        Sends the last read messages to the group.

        Args:
            consumer: The WebSocket consumer instance.
            event: The event data containing the messages to send.
        """
        await consumer.send(text_data=json.dumps(event['messages'], ensure_ascii=False))

    @staticmethod
    async def message_delete(consumer, event) -> None:
        """
        Deletes a message and its attachments.

        Args:
            consumer: The WebSocket consumer instance.
            event: The event data containing the message ID.
        """
        message_id = event['message_id']
        try:
            # Delete the message from the database
            await sync_to_async(lambda: Message.objects.filter(id=message_id).delete(), thread_sensitive=True)()
            # Notify the client of the deletion
            await consumer.send(text_data=json.dumps({'type': 'message_deleted', 'message_id': message_id}))
        except Exception:
            pass

    @staticmethod
    async def message_edit(consumer, event) -> None:
        """
        Edits a message's text content.

        Args:
            consumer: The WebSocket consumer instance.
            event: The event data containing the message ID and new text.
        """
        message_id, message_text = event['message_id'], event['message_text']
        try:
            # Update the message text in the database
            await sync_to_async(
                lambda: Message.objects.filter(id=message_id).update(text=message_text),
                thread_sensitive=True,
            )()
            # Notify the client of the edit
            await consumer.send(
                text_data=json.dumps(
                    {
                        'type': 'message_edited',
                        'message_id': message_id,
                        'text': message_text,
                    },
                    ensure_ascii=False,
                )
            )
        except Exception:
            pass
