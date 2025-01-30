from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    users = models.ManyToManyField(User, related_name="chat_rooms")  
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return " / ".join([user.username for user in self.users.all()])
    
    class Meta:
        db_table = 'ChatRoom'
        

