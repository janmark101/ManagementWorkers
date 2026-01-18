from django.db import models
from django.contrib.auth.models import User

class FCMDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    registration_id = models.TextField(unique=True) # firebase token
    type = models.CharField(max_length=10, default='android')
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.type})"