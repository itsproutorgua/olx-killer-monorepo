import json
from typing import Any

from asgiref.sync import sync_to_async
from django.core.exceptions import FieldError

from apps.chat.models.message import Message


async def chat_message(consumer, event: dict[str, Any]) -> None:
    message_id = event['message_id']
    message = await get_message(message_id)
    message_data = await serialize_message(message)

    await consumer.send(
        text_data=json.dumps(
            {
                'type': 'chat_message',
                'message': message_data,
            }
        )
    )

    await mark_message_as_delivered(consumer, message_id)


async def mark_message_as_delivered(consumer, message_id: int) -> None:
    await update_message_status(message_id, Message.Status.DELIVERED)
    message = await get_message(message_id)
    message_data = await serialize_message(message)

    await consumer.send(
        text_data=json.dumps(
            {
                'type': 'mark_message_as_delivered',
                'message': message_data,
            }
        )
    )

    room = consumer.room
    recipient = await sync_to_async(room.get_recipient)(consumer.scope['first_user'])
    if recipient and await consumer.is_user_online(recipient):
        await mark_message_as_read(consumer, message_id)


async def mark_message_as_read(consumer, message_id: int) -> None:
    await update_message_status(message_id, Message.Status.READ)
    message = await get_message(message_id)
    message_data = await serialize_message(message)

    await consumer.send(
        text_data=json.dumps(
            {
                'type': 'mark_message_as_read',
                'message': message_data,
            }
        )
    )


async def serialize_message(message: Message) -> dict:
    return await sync_to_async(
        lambda: {
            'text': message.text,
            'message_id': message.id,
            'sender_id': message.sender.id,
            'status': message.status,
            'created_at': message.created_at.isoformat(),
            'updated_at': message.updated_at.isoformat(),
        },
        thread_sensitive=True,
    )()


async def get_message(message_id: int) -> Message:
    return await sync_to_async(lambda: Message.objects.get(id=message_id))()


async def update_message_status(message_id: int, status: Message.Status) -> None:
    await sync_to_async(
        lambda: Message.objects.filter(id=message_id).update(status=status),
        thread_sensitive=True,
    )()


async def save_message(consumer, message_text: str) -> Message:
    return await sync_to_async(
        lambda: Message.objects.create(
            chat_room=consumer.room,
            sender=consumer.scope['first_user'],
            text=message_text,
        ),
        thread_sensitive=True,
    )()


async def send_last_messages(consumer) -> None:
    try:
        messages = await sync_to_async(
            lambda: list(
                Message.objects.filter(chat_room=consumer.room).select_related('sender').order_by('created_at')[:50]
            ),
            thread_sensitive=True,
        )()
    except FieldError:
        messages = []

    messages_data = []
    for msg in messages:
        if msg.status == Message.Status.DELIVERED:
            await update_message_status(msg.id, Message.Status.READ)
            msg.status = Message.Status.READ
        messages_data.append(
            {
                'message_id': msg.id,
                'text': msg.text,
                'sender_email': msg.sender.email,
                'status': msg.status,
                'created_at': msg.created_at.isoformat(),
                'updated_at': msg.updated_at.isoformat(),
            }
        )

    await consumer.send(text_data=json.dumps(messages_data))


async def message_delete(consumer, message_id: int) -> None:
    await sync_to_async(
        lambda: Message.objects.filter(id=message_id).delete(),
        thread_sensitive=True,
    )()

    await consumer.send(
        text_data=json.dumps(
            {
                'type': 'message_deleted',
                'message_id': message_id,
            }
        )
    )


async def message_edit(consumer, message_id: int, message_text: str) -> None:
    await sync_to_async(
        lambda: Message.objects.filter(id=message_id).update(text=message_text), thread_sensitive=True
    )()

    await consumer.send(
        text_data=json.dumps(
            {
                'type': 'message_edited',
                'message_id': message_id,
                'text': message_text,
            }
        )
    )
