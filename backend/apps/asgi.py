"""
ASGI config for olx_killer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '..settings.main')
django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter
from django.core.asgi import get_asgi_application

from .chat.routing import websocket_urlpatterns





application = ProtocolTypeRouter(
    {'http': get_asgi_application(), 'websocket': AuthMiddlewareStack(URLRouter(websocket_urlpatterns))}
)

