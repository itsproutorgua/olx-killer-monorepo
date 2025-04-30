import json

from channels.generic.websocket import AsyncWebsocketConsumer

from apps.chat.utils.messages import MessageUtils
from apps.chat.utils.rooms import RoomUtils
from apps.chat.utils.users import UserUtils


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get room id from query params
        try:
            query_params = self.scope['query_params']

            self.scope['room_id'] = query_params['room_id'][0]
        except KeyError:
            raise KeyError('Enter correct query params')

        # Authenticate user
        self.scope['first_user'] = await UserUtils.authenticate_user(self.scope)
        if not self.scope['first_user']:
            return await self.close(4001, 'Authentication failed')

        # Get room
        self.room = await RoomUtils.get_chat_room(room_id=self.scope['room_id'])
        self.chat_group_name = f'chat_{self.scope["room_id"]}'

        # Ensure that is right user
        await UserUtils.validate_user(self)

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
                # Delete Message
                message_id = data.get('message_id')
                sender_id = data.get('sender_id')
                if await UserUtils.is_vaild_sender(message_id, sender_id):
                    await MessageUtils.message_delete(self, message_id)
            elif action == 'edit':
                # Edit message
                message_id = data.get('message_id')
                message_text = data.get('text')
                sender_id = data.get('sender_id')
                if await UserUtils.is_vaild_sender(message_id, sender_id):
                    await MessageUtils.message_edit(self, message_id, message_text)

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')

    async def chat_message(self, event):
        await MessageUtils.chat_message(self, event)

    async def mark_message_as_delivered(self, message_id):
        await MessageUtils.mark_message_as_delivered(self, message_id)

    async def mark_message_as_read(self, message_id):
        await MessageUtils.mark_message_as_read(self, message_id)

    async def send_last_readed_messages(self, event):
        await MessageUtils.send_last_readed_messages(self, event)

    async def get_recipient(self):
        return await UserUtils.get_recipient(self.room, self.scope['first_user'])

    async def message_delete(self, event):
        await MessageUtils.message_delete(self, event)

    async def message_edit(self, event):
        await MessageUtils.message_edit(self, event)

