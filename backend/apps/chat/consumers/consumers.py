import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.exceptions import AuthenticationFailed

from apps.users.authentication import Auth0JWTAuthentication

from ..models.chat import ChatRoom


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # get room id
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.chat_group_name = f'chat_{self.room_id}'

        # get room
        self.room = await sync_to_async(
            lambda: ChatRoom.objects.filter(id=self.room_id).first(), thread_sensitive=True
        )()

        if self.room is None:
            await self.close()

        # get token from headers
        headers = dict(self.scope.get('headers'))
        token = (
            headers.get(b'authorization', b'').decode('utf-8').split(' ')[1] if b'authorization' in headers else None
        )

        # vaildate token
        if not token:
            raise AuthenticationFailed('Authorization token is missing')

        auth0_auth = Auth0JWTAuthentication()

        try:
            validated_token = auth0_auth.get_validated_token(token)
            self.scope['user'] = await sync_to_async(auth0_auth.get_user)(validated_token)
        except AuthenticationFailed as e:
            await self.close()
            raise e

        # get user emails from room
        self.users = await sync_to_async(
            lambda: list(
                ChatRoom.objects.select_related('first_user', 'second_user')
                .filter(id=self.room_id)
                .values_list('first_user__email', 'second_user__email')
            ),
            thread_sensitive=True,
        )()

        if not self.users:
            await self.close()

        user1_email, user2_email = self.users[0]

        # check if connected user is in the room
        if self.scope['user'].email not in {user1_email, user2_email}:
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
        await self.channel_layer.group_send(self.chat_group_name, {'type': 'chat_message', 'message': message})

    # Receive message from chat group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({'message': message}))
