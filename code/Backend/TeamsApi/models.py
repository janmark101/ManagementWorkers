from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    name = models.CharField(max_length=250,null=False,blank=False)
    unique_code = models.CharField(max_length=8,null=True,blank=True,unique=True)
    manager = models.ForeignKey(User,blank=False,null=False,on_delete=models.CASCADE)
    workers = models.ManyToManyField(User,blank=True,related_name='teams')
    description = models.CharField(max_length=1000,null=True,blank=True)

    def __str__(self):
        return self.name
    
    
class Task(models.Model):
    name=models.CharField(max_length=50,null=False,blank=False)
    description = models.CharField(max_length=500,null=False,blank=False)
    team_id = models.ForeignKey(Team,null=False,blank=False,on_delete=models.CASCADE)
    workers_id = models.ManyToManyField(User,blank=True)
    status = models.CharField(max_length=20,default="Not started")
    error = models.CharField(max_length=500,null=True,blank=True)
    date = models.DateTimeField(null=False,blank=False)
    
    
    def __str__(self):
        return "Task " + self.name