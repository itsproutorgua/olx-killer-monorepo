import json

from asgiref.sync import sync_to_async
from django.core.exceptions import FieldError
from apps.chat.models.message import Message


async def chat_message(consumer, event):
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


async def mark_message_as_delivered(consumer, message_id):
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

    recipient = await consumer.get_recipient()
    if recipient and await consumer.is_user_online(recipient):
        await mark_message_as_read(consumer, message_id)


async def mark_message_as_read(consumer, message_id):
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


async def serialize_message(message):
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


async def get_message(message_id):
    return await sync_to_async(lambda: Message.objects.get(id=message_id))()


async def update_message_status(message_id, status):
    await sync_to_async(
        lambda: Message.objects.filter(id=message_id).update(status=status),
        thread_sensitive=True,
    )()


async def save_message(consumer, message_text):
    return await sync_to_async(
        lambda: Message.objects.create(
            chat_room=consumer.room,
            sender=consumer.scope['user'],
            text=message_text,
        ),
        thread_sensitive=True,
    )()


async def send_last_messages(consumer):
    try:
        messages = await sync_to_async(
            lambda: list(
                Message.objects.filter(chat_room=consumer.room)
                .select_related('sender')
                .values('text', 'sender__email')
                .order_by('-created_at')[:50]
            ),
            thread_sensitive=True,
        )()
    except FieldError:
        messages = []

    messages_data = [{'text': msg['text'], 'sender_email': msg['sender__email']} for msg in messages]
    await consumer.send(text_data=json.dumps(messages_data))
