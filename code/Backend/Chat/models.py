from django.db import models
from django.contrib.auth.models import User
from TeamsApi.models import Team


class TeamMessage(models.Model):
    team = models.ForeignKey(Team,on_delete=models.CASCADE)
    sender = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField()
    send_date = models.DateTimeField(auto_now_add=True)
# Create your models here.
