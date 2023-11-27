from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from TeamsApi.permissions import CustomPersmissions
from . models import Team, Task
from .serializers import TeamSerializer,TaskSerializer
from django.utils.crypto import get_random_string
from django.db.models import Q


class TeamsView(APIView):
    permission_classes=[CustomPersmissions]

    def get(self,request,format=None):
        self.check_permissions(self.request)
        user = request.user.id
        teams = Team.objects.filter(Q(workers__id=user) | Q(manager=user)) 
        serializer = TeamSerializer(teams,many=True)
        return Response(serializer.data)

    def post(self,request,format=None):
        self.check_permissions(self.request)
        data = request.data.copy()
        
        data['manager'] = request.user.id
        
        while True:
            unique_code = get_random_string(8)
            if not Team.objects.filter(unique_code=unique_code).exists():
                break
            
        data['unique_code'] = unique_code
        
        serializer = TeamSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message" : 'Team created!',"unique_code" : unique_code},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class TasksForTeamView(APIView):
    permission_classes=[CustomPersmissions]
    
    def get(self,request,id,format=None):
        self.check_permissions(self.request)
        team = get_object_or_404(Team,pk=id)
        user = request.user.id
        if user == team.manager.id:
            tasks = Task.objects.filter(team_id=id)
            serializer = TaskSerializer(tasks,many=True)
        else:
            tasks = Task.objects.filter(Q(workers_id__id=user) & Q(team_id__id=id)) 
            serializer = TaskSerializer(tasks,many=True)
        return Response(serializer.data)
    
    def post(self,request,id,format=None):
        self.check_permissions(self.request)
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message" : 'Task created!'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)