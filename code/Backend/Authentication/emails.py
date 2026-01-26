from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile
import random

def send_verify_email(email):
    try:
        subject = 'Workerks Management verification code'
        email_from = settings.EMAIL_HOST_USER
        code = random.randint(100000, 999999)
        message = f'Your code to verify is: {code}'
        
        send_mail(subject, message, email_from, [email], fail_silently=False)

        user_profile = UserProfile.objects.get(user__email=email)
        user_profile.verify_code = code
        user_profile.save()
        
        return True
    except Exception as e:
        print(f"Error while sending verification mail: {e}")
        return False
    
    
    