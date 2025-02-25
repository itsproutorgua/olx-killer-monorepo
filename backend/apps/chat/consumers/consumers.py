import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer

from apps.chat.consumers.messages_operations import chat_message
from apps.chat.consumers.messages_operations import get_message
from apps.chat.consumers.messages_operations import mark_message_as_delivered
from apps.chat.consumers.messages_operations import mark_message_as_read
from apps.chat.consumers.messages_operations import message_delete
from apps.chat.consumers.messages_operations import message_edit
from apps.chat.consumers.messages_operations import save_message
from apps.chat.consumers.messages_operations import send_last_messages
from apps.chat.consumers.messages_operations import serialize_message
from apps.chat.consumers.users_and_rooms_operations import authenticate_user
from apps.chat.consumers.users_and_rooms_operations import get_chat_room
from apps.chat.consumers.users_and_rooms_operations import get_recipient
from apps.chat.consumers.users_and_rooms_operations import is_user_online
from apps.chat.consumers.users_and_rooms_operations import update_user_status
from apps.chat.consumers.users_and_rooms_operations import create_or_get_room
from apps.chat.consumers.users_and_rooms_operations import validate_user
 

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_params = self.scope['query_params']

        self.scope['first_user_id'] = query_params['first_user'][0]
        self.scope['second_user'] = query_params['second_user'][0]

        if self.scope['first_user_id'] == self.scope['second_user']:
            await self.close()

        # Authenticate user
        self.scope['first_user'] = await authenticate_user(self.scope)
        if not self.scope['first_user']:
            return await self.close()
        
        await validate_user(self)
        
        id = await create_or_get_room(self.scope['first_user'], self.scope['second_user'])
        self.room_id = id
        self.chat_group_name = f'chat_{self.room_id}'

        # Get chat room object
        self.room = await get_chat_room(self.room_id)
        if not self.room:
            return await self.close()

        # Connect to chat group
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.accept('Bearer')

        # Sending last messages
        await send_last_messages(self)

        # Update user status
        await update_user_status(self.scope['first_user'], is_online=True)

    async def disconnect(self, close_code):
        # Leave chat group
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

        # Update user status
        await update_user_status(self.scope['first_user'], is_online=False)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'send':
                message_text = data.get('message')
                # Save message to database
                message = await save_message(self, message_text)
                # Send message to chat group
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        'type': 'chat_message',
                        'message_id': message.id,
                    },
                )
            elif action == 'delete':
                message_id = data.get('message_id')
                await message_delete(self, message_id)
            elif action == 'edit':
                message_id = data.get('message_id')
                message_text = data.get('text')
                await message_edit(self, message_id, message_text)

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')

    async def chat_message(self, event):
        await chat_message(self, event)

    async def mark_message_as_delivered(self, message_id):
        await mark_message_as_delivered(self, message_id)

    async def mark_message_as_read(self, message_id):
        await mark_message_as_read(self, message_id)

    async def get_recipient(self):
        return await get_recipient(self.room, self.scope['first_user'])

    async def message_delete(self, event):
        await message_delete(self, event)

    async def message_edit(self, event):
        await message_edit(self, event)

    @staticmethod
    async def is_user_online(user):
        return await is_user_online(user)

    @staticmethod
    async def get_message(message_id):
        return await get_message(message_id)

    @staticmethod
    async def serialize_message(message):
        return await serialize_message(message)
