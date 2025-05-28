from typing import Optional
from typing import Tuple

from channels.db import database_sync_to_async
from django.db.utils import IntegrityError
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

from apps.chat.exceptions.exceptions import DatabaseIntegrityError
from apps.chat.exceptions.exceptions import InvalidTokenFormatError
from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.models.useractivity import UserActivity
from apps.users.authentication import Auth0JWTAuthentication
from apps.users.models import User


class UserUtils:
    @staticmethod
    @database_sync_to_async
    def update_user_status(user: User, is_online: bool) -> None:
        """
        Update user online/offline status and last seen timestamp.

        Args:
            user (User): The user to update.
            is_online (bool): Whether the user is online.
        """
        status = UserActivity.Status.ONLINE if is_online else UserActivity.Status.OFFLINE
        try:
            UserActivity.objects.update_or_create(
                user=user,
                defaults={'status': status, 'last_seen': timezone.now()},
            )
        except IntegrityError:
            raise DatabaseIntegrityError()

    @staticmethod
    async def authenticate_user(scope: dict) -> Optional[User]:
        """
        Authenticate a user from WebSocket subprotocols.

        Args:
            scope (dict): WebSocket connection scope.

        Returns:
            Optional[User]: Authenticated user or None if authentication fails.
        """
        subprotocols = scope.get('subprotocols', [])
        try:
            if not subprotocols or subprotocols[0] != 'Bearer':
                return None
            token = subprotocols[1]
            if not token:
                return None

            auth0_auth = Auth0JWTAuthentication()
            validated_token = auth0_auth.get_validated_token(token)
            return await database_sync_to_async(auth0_auth.get_user)(validated_token)
        except AuthenticationFailed:
            raise
        except (AttributeError, IndexError):
            raise InvalidTokenFormatError()
        except IntegrityError:
            raise DatabaseIntegrityError()

    @staticmethod
    @database_sync_to_async
    def get_users(room: ChatRoom) -> Tuple[User, User]:
        """
        Retrieve both users associated with a chat room.

        Args:
            room (ChatRoom): The chat room to query.

        Returns:
            Tuple[User, User]: The first and second users of the room.
        """
        return room.first_user, room.second_user

    @staticmethod
    async def validate_user(consumer) -> bool:
        """
        Validate if the user is a participant in the chat room.

        Args:
            consumer: The WebSocket consumer instance.

        Returns:
            bool: True if user is valid, False otherwise (closes connection if invalid).
        """
        first_user = consumer.scope['first_user']
        room = consumer.room
        room_first_user, room_second_user = await UserUtils.get_users(room)

        if first_user not in [room_first_user, room_second_user]:
            await consumer.close()
            return False
        return True

    @staticmethod
    @database_sync_to_async
    def is_valid_sender(message_id: int, sender: User) -> bool:
        """
        Check if the sender is the author of the message.

        Args:
            message_id (int): The ID of the message.
            sender (User): The user to validate.

        Returns:
            bool: True if the sender is valid, False otherwise.
        """
        message = Message.objects.select_related('sender').filter(id=message_id).first()
        return message.sender == sender if message else False

    @staticmethod
    @database_sync_to_async
    def get_recipient(room: ChatRoom, user: User) -> Optional[User]:
        """
        Get the recipient user of a chat room relative to the given user.

        Args:
            room (ChatRoom): The chat room.
            user (User): The user to find the recipient for.

        Returns:
            Optional[User]: The recipient user or None if not found.
        """
        return room.get_recipient(user)

    @staticmethod
    @database_sync_to_async
    def is_user_online(user: User) -> bool:
        """
        Check if a user is online.

        Args:
            user (User): The user to check.

        Returns:
            bool: True if the user is online, False otherwise.
        """
        return UserActivity.objects.filter(user=user, status=UserActivity.Status.ONLINE).exists()
