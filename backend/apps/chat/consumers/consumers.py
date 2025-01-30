from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ..models.chat import ChatRoom
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_name = self.scope['url_route']['kwargs']['room_name']
        self.chat_group_name = f'chat_{self.chat_name}'

        self.room = await database_sync_to_async(ChatRoom.objects.get)(id=self.room_name)

        if self.room is None:
            await self.close()

        # Connect to chat group
        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Disconnect from chat group
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name,
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        test_data_json = json.loads(text_data)
        message = test_data_json['message']

        # Send message to chat group
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from chat group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))