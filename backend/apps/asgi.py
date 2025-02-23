"""
ASGI config for olx_killer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')
django.setup()

from channels.auth import AuthMiddlewareStack  # noqa: E402
from channels.routing import ProtocolTypeRouter  # noqa: E402
from channels.routing import URLRouter  # noqa: E402
from django.core.asgi import get_asgi_application  # noqa: E402

from apps.chat.routing import websocket_urlpatterns  # noqa: E402


application = ProtocolTypeRouter(
    {'http': get_asgi_application(), 'websocket': AuthMiddlewareStack(URLRouter(websocket_urlpatterns))}
)
