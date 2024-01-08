from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class UserProfile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    verify_code = models.CharField(max_length=6,blank=True,null=True)
    
    
    def __str__(self):
        return f"profile for : {self.user}, id : {self.user.id}"