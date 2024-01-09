from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile
import random


def send_verify_email(email):
    subcject = 'Workerks Management verification code'
    email_from = settings.EMAIL_HOST_USER
    code = random.randint(100000, 999999)
    message = f'Your code to verify is :  {code}'
    send_mail(subcject,message,email_from,[email])
    user_profile = UserProfile.objects.get(user__email=email)
    user_profile.verify_code = code
    user_profile.save()
    
    
    