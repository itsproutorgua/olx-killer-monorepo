import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer

from apps.chat.utils.messages import MessageUtils
from apps.chat.utils.rooms import RoomUtils
from apps.chat.utils.users import UserUtils


logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            query_params = self.scope['query_params']

            self.scope['first_user_id'] = query_params['first_user'][0]
            self.scope['second_user'] = query_params['second_user'][0]
        except KeyError:
            raise KeyError('Enter correct query params')

        if self.scope['first_user_id'] == self.scope['second_user']:
            return await self.close(4003, "Users must be different")
        
        logger.debug(f"Scope: {self.scope}")

        # Authenticate user
        self.scope['first_user'] = await UserUtils.authenticate_user(self.scope)
        if not self.scope['first_user']:
            return await self.close(4001, "Authentication failed")
        
        logger.debug(f"First user: {self.scope['first_user']}")

        await UserUtils.validate_user_id(self)

        id = await RoomUtils.create_or_get_room(self.scope['first_user'], self.scope['second_user'])
        self.room_id = id
        self.chat_group_name = f'chat_{self.room_id}'

        # Get chat room object
        self.room = await RoomUtils.get_chat_room(self.room_id)
        if not self.room:
            return await self.close(4004, "Chat room not found")

        # Connect to chat group
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        await self.accept('Bearer')

        # Sending last messages
        await MessageUtils.send_last_messages(self)

        # Update user status
        await UserUtils.update_user_status(self.scope['first_user'], is_online=True)

    async def disconnect(self, close_code):
        # Leave chat group
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

        # Update user status
        await UserUtils.update_user_status(self.scope['first_user'], is_online=False)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'send':
                message_text = data.get('message')
                # Save message to database
                message = await MessageUtils.save_message(self, message_text)
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
                sender_id = data.get('sender_id')
                if UserUtils.is_vaild_sender(message_id, sender_id):
                    await MessageUtils.message_delete(self, message_id)
            elif action == 'edit':
                message_id = data.get('message_id')
                message_text = data.get('text')
                sender_id = data.get('sender_id')
                if UserUtils.is_vaild_sender(message_id, sender_id):
                    await MessageUtils.message_edit(self, message_id, message_text)

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')

    async def chat_message(self, event):
        await MessageUtils.chat_message(self, event)

    async def mark_message_as_delivered(self, message_id):
        await MessageUtils.mark_message_as_delivered(self, message_id)

    async def mark_message_as_read(self, message_id):
        await MessageUtils.mark_message_as_read(self, message_id)

    async def get_recipient(self):
        return await UserUtils.get_recipient(self.room, self.scope['first_user'])

    async def message_delete(self, event):
        await MessageUtils.message_delete(self, event) 

    async def message_edit(self, event):
        await MessageUtils.message_edit(self, event)
