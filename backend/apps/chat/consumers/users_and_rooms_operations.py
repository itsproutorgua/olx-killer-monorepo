from asgiref.sync import sync_to_async
from django.db.utils import IntegrityError
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

from apps.chat.exceptions.exceptions import DatabaseIntegrityError
from apps.chat.exceptions.exceptions import InvalidTokenFormatError
from apps.chat.exceptions.exceptions import MalformedAuthorizationHeaderError
from apps.chat.models.chat import ChatRoom
from apps.chat.models.useractivity import UserActivity
from apps.users.authentication import Auth0JWTAuthentication
from apps.users.models import User


async def update_user_status(user: User, is_online: bool) -> None:
    status = UserActivity.Status.ONLINE if is_online else UserActivity.Status.OFFLINE

    await sync_to_async(
        lambda: UserActivity.objects.update_or_create(
            user=user,
            defaults={'status': status, 'last_seen': timezone.now()},
        ),
        thread_sensitive=True,
    )()


async def get_chat_room(room_id: int) -> ChatRoom:
    return await sync_to_async(lambda: ChatRoom.objects.filter(id=room_id).first(), thread_sensitive=True)()


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


async def is_user_in_chat(room_id: int, user_email: str) -> bool:
    users = await sync_to_async(
        lambda: list(
            ChatRoom.objects.select_related('first_user', 'second_user')
            .filter(id=room_id)
            .values_list('first_user__email', 'second_user__email')
        ),
        thread_sensitive=True,
    )()

    return bool(users) and user_email in users[0]


async def get_recipient(room: ChatRoom, user: User) -> User:
    return await sync_to_async(lambda: room.get_recipient(user))()


async def is_user_online(user: User) -> bool:
    return await sync_to_async(
        lambda: UserActivity.objects.filter(user=user, status=UserActivity.Status.ONLINE).exists()
    )()
