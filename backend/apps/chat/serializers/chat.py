from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.chat.models.chat import ChatRoom


User = get_user_model()


class ChatCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'first_user', 'second_user']

    def validate(self, attrs):
        first_user = attrs.get('first_user')
        second_user = attrs.get('second_user')

        if first_user == second_user:
            raise serializers.ValidationError(_('Users id are same'))

        room = ChatRoom.objects.filter(
            Q(first_user=first_user, second_user=second_user) | Q(first_user=second_user, second_user=first_user)
        )

        if room:
            raise serializers.ValidationError(_('The fields first_user, second_user must make a unique set.'))

        return super().validate(attrs)


class ChatRetrieveSerialzier(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'first_user', 'second_user']
