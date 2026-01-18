import firebase_admin
from firebase_admin import credentials, messaging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth.models import User
import os
from Chat.models import TeamMessage
from .models import FCMDevice

CRED_PATH = os.path.join(settings.BASE_DIR, 'firebase-admin.json')

if not firebase_admin._apps:
    if os.path.exists(CRED_PATH):
        cred = credentials.Certificate(CRED_PATH)
        firebase_admin.initialize_app(cred)
    else:
        print("Warning: firebase-admin.json not found.")

@receiver(post_save, sender=TeamMessage)
def send_notification_on_new_message(sender, instance, created, **kwargs):
    
    print("send_notification_on_new_message")
    if created:
        message = instance
        team = message.team
        author = message.sender
        recipient_ids = set(team.workers.values_list('id', flat=True))
        
        if team.manager:
            recipient_ids.add(team.manager.id)
            
        # do not send to self
        if author.id in recipient_ids:
            recipient_ids.remove(author.id)
            
        if not recipient_ids:
            return

        devices = FCMDevice.objects.filter(user__id__in=recipient_ids, active=True)
                
        if not devices.exists():
            return

        tokens = list(set(device.registration_id for device in devices))
        
        if not tokens:
            return

        try:
            notification_title = team.name
            notification_body = f"{author.first_name if author.first_name else author.username}: {message.content}"
            
            # trucane message if too long
            if len(notification_body) > 100:
                notification_body = notification_body[:97] + "..."

            message_payload = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=notification_title,
                    body=notification_body
                ),
                data={
                    # in app redirection
                    'team_id': str(team.id),
                    'click_action': 'FCM_PLUGIN_ACTIVITY',
                    'type': 'chat_message'
                },
                tokens=tokens,
            )
            
            response = messaging.send_each_for_multicast(message_payload)
            print(f"PUSH SENT: {response.success_count} sent, {response.failure_count} failed.")
            
        except Exception as e:
            print(f"PUSH ERROR: {e}")