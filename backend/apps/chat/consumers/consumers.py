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


# Set up logging for the module
logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Establishes a WebSocket connection for the chat application.
        """
        try:
            # Retrieve query parameters from the WebSocket scope
            query_params = self.scope.get('query_params', {})
            # Extract room_id from query parameters; default to None if not found
            room_id = query_params.get('room_id', [None])[0]
            if not room_id:
                raise ValueError('Missing or invalid room_id')
            # Store the room_id in the scope for later use
            self.scope['room_id'] = room_id
        except (KeyError, IndexError):
            raise ValueError('Invalid query parameters')

        # Authenticate the user based on the scope data
        self.scope['first_user'] = await UserUtils.authenticate_user(self.scope)
        if not self.scope['first_user']:
            # Deny connection if authentication fails
            raise DenyConnection(code=4001, reason='Authentication failed')

        # Fetch the chat room based on the provided room_id
        self.room = await RoomUtils.get_chat_room(int(self.scope['room_id']))
        if not self.room:
            # Deny connection if the room does not exist
            raise DenyConnection(code=4004, reason='Room not found')
        # Define the chat group name using the room_id
        self.chat_group_name = f'chat_{self.scope["room_id"]}'

        # Validate the user's access to the room
        if not await UserUtils.validate_user(self):
            # Deny connection if the user is not authorized
            raise DenyConnection(code=403, reason='Unauthorized user')

        # Add this consumer instance to the chat group
        await self.channel_layer.group_add(self.chat_group_name, self.channel_name)
        # Accept the WebSocket connection with Bearer token authentication
        await self.accept('Bearer')

        # Send the last messages in the room to the connected user
        await MessageUtils.send_last_messages(self)
        # Update the user's online status to true
        await UserUtils.update_user_status(self.scope['first_user'], is_online=True)

    async def disconnect(self, close_code: int) -> None:
        """
        Handles the disconnection of the WebSocket.
        """
        if hasattr(self, 'chat_group_name'):
            # Remove this consumer from the chat group if chat_group_name exists
            await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)
        # Update the user's online status to false upon disconnection
        await UserUtils.update_user_status(self.scope['first_user'], is_online=False)

    async def receive(self, text_data: str) -> None:
        """
        Processes incoming messages received via the WebSocket.
        """
        try:
            # Parse the incoming JSON data
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'send':
                # Extract message text and optional file metadata from the data
                message_text = data.get('message', '')
                file_metadata = data.get('file')

                # Save the message to the database
                message = await MessageUtils.save_message(self, message_text, file_metadata)
                # Broadcast the message to all members of the chat group
                await self.channel_layer.group_send(
                    self.chat_group_name,
                    {
                        'type': 'chat_message',
                        'message_id': message.id,
                    },
                )
            elif action == 'delete':
                message_id = data.get('message_id')
                if not message_id:
                    # Send an error if message_id is missing
                    await self.send_error('Missing message_id')
                    return
                if await UserUtils.is_valid_sender(message_id, self.scope['first_user']):
                    # Broadcast the deletion event to the chat group
                    await self.channel_layer.group_send(
                        self.chat_group_name,
                        {'type': 'message_delete', 'message_id': message_id},
                    )
                else:
                    # Send an error if the user is not authorized to delete the message
                    await self.send_error('Unauthorized to delete message')

            elif action == 'edit':
                message_id = data.get('message_id')
                message_text = data.get('text')
                if not (message_id and message_text):
                    # Send an error if either message_id or text is missing
                    await self.send_error('Missing message_id or text')
                    return
                if await UserUtils.is_valid_sender(message_id, self.scope['first_user']):
                    # Broadcast the edit event to the chat group
                    await self.channel_layer.group_send(
                        self.chat_group_name,
                        {
                            'type': 'message_edit',
                            'message_id': message_id,
                            'message_text': message_text,
                        },
                    )
                else:
                    # Send an error if the user is not authorized to edit the message
                    await self.send_error('Unauthorized to edit message')

        except json.JSONDecodeError:
            # Send an error if the incoming data is not valid JSON
            await self.send_error('Invalid JSON format')
        except ValidationError as e:
            # Send an error if file validation fails
            await self.send_error(f'File validation failed: {str(e)}')
        except Exception as e:
            # Send a generic error for any other exceptions
            await self.send_error(f'Error processing request: {str(e)}')

    async def send_error(self, message: str) -> None:
        """
        Sends an error message back to the WebSocket client.
        """
        await self.send(text_data=json.dumps({'type': 'error', 'message': message}))

    async def chat_message(self, event: dict) -> None:
        """
        Processes the event of sending a chat message.
        """
        await MessageUtils.chat_message(self, event)

    async def mark_message_as_read(self, event: dict) -> None:
        """
        Processes the event of marking a message as read.
        """
        await MessageUtils.mark_message_as_read(self, event)

        # Notify the sender that their message has been read

    async def mark_message_as_delivered(self, event: dict) -> None:
        """
        Processes the event of marking a message as delivered.
        """
        await MessageUtils.mark_message_as_delivered(self, event.get('message_id'))

    async def send_last_readed_messages(self, event: dict) -> None:
        """
        Sends the last read messages to the client.
        """
        await MessageUtils.send_last_readed_messages(self, event)

    async def get_recipient(self) -> Optional[User]:
        """
        Retrieves the recipient user for the current chat room.
        """
        return await UserUtils.get_recipient(self.room, self.scope['first_user'])

    async def message_delete(self, event: dict) -> None:
        """
        Processes the event of deleting a message.
        """
        await MessageUtils.message_delete(self, event)

    async def message_edit(self, event: dict) -> None:
        """
        Processes the event of editing a message.
        """
        await MessageUtils.message_edit(self, event)
