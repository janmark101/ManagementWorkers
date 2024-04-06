from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Team(models.Model):
    name = models.CharField(max_length=250,null=False,blank=False)
    unique_code = models.CharField(max_length=8,null=True,blank=True,unique=True)
    adding_link_code = models.CharField(max_length=16,null=True,blank=True,unique=True)
    manager = models.ForeignKey(User,blank=False,null=False,on_delete=models.CASCADE)
    workers = models.ManyToManyField(User,blank=True,related_name='teams')
    description = models.CharField(max_length=1000,null=True,blank=True)
    adding_link_code_expiration_time = models.DateTimeField(blank=True,null=True)

    def __str__(self):
        return self.name
    
    def code_is_valid(self):
        expiration_time = self.adding_link_code_expiration_time
        return expiration_time is not None and expiration_time > timezone.now()
    
    
class Task(models.Model):
    name=models.CharField(max_length=500,null=False,blank=False)
    description = models.CharField(max_length=500,null=False,blank=False)
    team_id = models.ForeignKey(Team,null=False,blank=False,on_delete=models.CASCADE)
    workers_id = models.ManyToManyField(User,blank=True)
    status = models.CharField(max_length=20,default="Not started")   
    date = models.DateTimeField(null=False,blank=False)
    
    
    def __str__(self):
        return "Task " + self.name
    
    
    