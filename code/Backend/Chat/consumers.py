from django.contrib.auth.models import User
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from TeamsApi.models import Team

from .models import TeamMessage

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()
   

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']
        teamid = text_data_json['teamid']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message,
                'sender': sender,
                'teamid' : teamid
            }
        )

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        user = User.objects.get(pk=sender)
        teamid = event['teamid']
        self.send(text_data=json.dumps({
            'type':'chat',
            'message':message,
            'sender': f'{user.first_name} {user.last_name}',
            'teamid' : teamid
        }))

        print(event)

        team = Team.objects.get(pk=teamid)
        mess = TeamMessage.objects.create(
            sender = user,
            content = message,
            team = team
        )

        print(mess)
