from rest_framework import serializers
from . models import TeamMessage
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ('id','first_name','last_name')

class TeamMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(many=False,read_only=True)
    class Meta:
        model = TeamMessage
        fields = '__all__'
        ordering = ['-send_date']
        read_only_fields = ['team','sender']
        

    def validate(self,validated_data):
        team = self.context['team']
        user = self.context['user']
        validated_data['team'] = team
        validated_data['sender'] = user
        return validated_data
    