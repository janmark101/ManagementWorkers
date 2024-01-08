from rest_framework import serializers
from . models import Team,Task


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['manager']
        
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['team_id']
        
    def validate(self,validated_data):
        team = self.context['team']
        validated_data['team_id'] = team
        return validated_data
        
        
