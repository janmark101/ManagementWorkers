from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    name = models.CharField(max_length=250,null=False,blank=False)
    unique_code = models.CharField(max_length=8,null=False,blank=False,unique=True)
    manager = models.ForeignKey(User,blank=False,null=False,on_delete=models.CASCADE)
    workers = models.ManyToManyField(User,blank=True,related_name='teams')
    description = models.CharField(max_length=1000,null=True,blank=True)

    def __str__(self):
        return self.name