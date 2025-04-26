from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db.utils import IntegrityError
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

from apps.chat.exceptions.exceptions import DatabaseIntegrityError
from apps.chat.exceptions.exceptions import InvalidTokenFormatError
from apps.chat.exceptions.exceptions import MalformedAuthorizationHeaderError
from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.models.useractivity import UserActivity
from apps.users.authentication import Auth0JWTAuthentication
from apps.users.models import User
from apps.users.models.profile import Profile


class UserUtils:
    @staticmethod
    async def update_user_status(user: User, is_online: bool) -> None:
        status = UserActivity.Status.ONLINE if is_online else UserActivity.Status.OFFLINE

        await sync_to_async(
            lambda: UserActivity.objects.update_or_create(
                user=user,
                defaults={'status': status, 'last_seen': timezone.now()},
            ),
            thread_sensitive=True,
        )()

    @staticmethod
    async def authenticate_user(scope: dict) -> User:
        subprotocols = scope.get('subprotocols', [])
        token = None
        if subprotocols[0] == 'Bearer':
            token = subprotocols[1]
        if not token:
            return None

        auth0_auth = Auth0JWTAuthentication()
        try:
            validated_token = auth0_auth.get_validated_token(token)
            return await sync_to_async(auth0_auth.get_user)(validated_token)
        except AuthenticationFailed:
            raise
        except AttributeError:
            raise InvalidTokenFormatError()
        except IndexError:
            raise MalformedAuthorizationHeaderError()
        except IntegrityError:
            raise DatabaseIntegrityError()

    @staticmethod
    @database_sync_to_async
    def get_users(room):
        return room.first_user, room.second_user

    @staticmethod
    async def validate_user(consumer) -> None:
        first_user = consumer.scope['first_user']
        room = consumer.room

        room__first_user, room__second_user = await UserUtils.get_users(room)

        if first_user not in [room__first_user, room__second_user]:
            await consumer.close()

    @staticmethod
    async def is_vaild_sender(message_id: int, sender_id: int) -> bool:
        message = Message.objects.filter(id=message_id).first()
        sender_profile = Profile.objects.select_related('profile').get(id=sender_id)
        sender = sender_profile.user

        if message.sender != sender:
            return False
        return True

    @staticmethod
    async def get_recipient(room: ChatRoom, user: User) -> User:
        return await sync_to_async(lambda: room.get_recipient(user))()

    @staticmethod
    async def is_user_online(user: User) -> bool:
        return await sync_to_async(
            lambda: UserActivity.objects.filter(user=user, status=UserActivity.Status.ONLINE).exists()
        )()
