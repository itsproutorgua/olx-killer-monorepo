from django.contrib.auth import get_user_model
from django.db import models

from common.models.time_stamp import TimestampMixin


User = get_user_model()


class ChatRoom(TimestampMixin, models.Model):
    first_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='first_user', verbose_name='First User')
    second_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='second_user', verbose_name='Second User')

    def __str__(self):
        return ' / '.join([str(self.first_user), str(self.second_user)])

    def get_recipient(self, user):
        if user == self.first_user:
            return self.second_user
        return self.first_user

    class Meta:
        db_table = 'chatrooms'
        app_label = 'chat'
