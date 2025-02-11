from django.contrib.auth import get_user_model
from django.db import models

from ...common.models.time_stamp import TimestampMixin


User = get_user_model()


class ChatRoom(TimestampMixin, models.Model):
    first_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='first_user')
    second_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='second_user')

    def __str__(self):
        return ' / '.join([str(self.first_user), str(self.second_user)])

    class Meta:
        db_table = 'chatrooms'
