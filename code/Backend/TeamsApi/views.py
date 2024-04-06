from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from TeamsApi.permissions import CustomPersmissions
from . models import Team, Task
from .serializers import TeamSerializer,TaskSerializer
from django.utils.crypto import get_random_string
from django.db.models import Q
from Authentication.serializers import UserSerializer
from itertools import chain
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone

#returns all teams user joined or created
class TeamsView(APIView):
    permission_classes=[CustomPersmissions]

    def get(self,request,format=None):
        user = request.user.id
        teams = Team.objects.filter(manager=user)
        teams2 = Team.objects.filter(workers__id=user)
        combined_teams = list(chain(teams, teams2))
        serializer = TeamSerializer(combined_teams,many=True)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = TeamSerializer(data=request.data)

        while True:
            unique_code = get_random_string(8)
            if not Team.objects.filter(unique_code=unique_code).exists():
                break
            
        if serializer.is_valid():
            Team.objects.create(manager=request.user,name=serializer.validated_data['name'],description=serializer.validated_data['description'],unique_code=unique_code)
            return Response({"message" : 'Team created!',"unique_code" : unique_code},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class TeamNameView(TeamsView):
    permission_classes=[CustomPersmissions]

    def get(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        return Response({"name" : team.name},status=status.HTTP_200_OK)
    
class TasksForTeamView(APIView):
    permission_classes=[CustomPersmissions]
    
    def get(self,request,id,format=None):
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
        team = get_object_or_404(Team,pk=id)
        self.check_object_permissions(request,team)
        
        serializer = TaskSerializer(data=request.data,context={'team' : team})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message" : 'Task created!'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class JoinTeamView(APIView):
    permission_classes=[CustomPersmissions]
    
    def get(self,request,code,format=None):
        team = get_object_or_404(Team, Q(unique_code=code) | Q(adding_link_code=code))
        user = request.user
        if team.adding_link_code == code:
            if not team.code_is_valid():
                return Response({"error" : f"The code has expired"},status=status.HTTP_400_BAD_REQUEST)
        
        if user in team.workers.all():
            return Response({"message" : f"Already in team '{team.name}'!"},status=status.HTTP_400_BAD_REQUEST)
        else :
            if team.manager == user:
                return Response({"message" : 'You are manager of this team!'},status=status.HTTP_400_BAD_REQUEST)
            else:
                team.workers.add(user)
                return Response({"message" : f"Joined team : '{team.name}'!"},status=status.HTTP_200_OK)
    


class TeamUsersView(APIView):
    permission_classes=[CustomPersmissions]

    def get(self, request, pk,format=None):
        team = get_object_or_404(Team,pk=pk) 

        if request.user == team.manager or request.user in team.workers.all():
            workers = team.workers.all()
            serializer = UserSerializer(workers, many=True)
            if request.user == team.manager:
                return Response({'data': serializer.data,'manager':True},status=status.HTTP_200_OK)
            else:
                return Response({'data': serializer.data,'manager':False},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
        

        
class TaskObjectView(APIView):
    permission_classes=[CustomPersmissions]
    
    def get(self,request,pk,id,format=None):
        team = get_object_or_404(Team,pk=pk)
        task = get_object_or_404(Task,pk=id)
        if request.user == team.manager or (request.user in team.workers.all() and request.user in task.workers_id.all()):
            serializer = TaskSerializer(task,many=False)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


    def delete(self, request, pk,id,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        task = get_object_or_404(Task,pk=id)
        task.delete()
        return Response({'message' : 'Task sucessfully deleted!'},status=status.HTTP_200_OK)
    
    
    def put(self,request,pk,id,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        task = get_object_or_404(Task,pk=id)
        
        serializer = TaskSerializer(task,data=request.data,context={'team' : team})
        if serializer.is_valid():
            serializer.save()
            return Response({'message' : 'Task sucessfully edited!'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_200_OK)
            

class TeamCodeObject(APIView):
    permission_classes=[CustomPersmissions]
    
    def get(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        if team.manager == request.user:
            return Response({'code':team.unique_code},status=status.HTTP_200_OK)
        return Response({'error':'You dont have permissions'},status=status.HTTP_403_FORBIDDEN)
    
    def post(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        
        while True:
            unique_code = get_random_string(8)
            if not Team.objects.filter(unique_code=unique_code).exists():
                break
        team.unique_code = unique_code
        team.save()
        return Response({'code':team.unique_code},status=status.HTTP_200_OK)

    
    
class TeamObjectView(APIView):
    permission_classes = [CustomPersmissions]
    
    def post(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        if request.user == team.manager:
            return Response({'message' : 'Manager can not leave the team!'},status=status.HTTP_400_BAD_REQUEST)
        if request.user in team.workers.all():
            team.workers.remove(request.user)
            tasks = Task.objects.filter(Q(team_id=team) & Q(workers_id__id=request.user.id))
            for task in tasks:
                task.workers_id.remove(request.user)
            return Response({'message' : 'You have left the team.'},status=status.HTTP_200_OK)
        return Response({'message' : 'You are not in this team!'},status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk) 
        self.check_object_permissions(self.request,team)
        team.delete()
        return Response({'message':'Team delated!'},status=status.HTTP_204_NO_CONTENT)
    
    
class RemoveUserFromTeamView(APIView):
    permission_classes = [CustomPersmissions]
    
    def post(self,request,pk,id,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        user = get_object_or_404(User,pk=id)
        if user in team.workers.all():
            team.workers.remove(user)
            tasks = Task.objects.filter(Q(team_id=team) & Q(workers_id__id=user.id))
            for task in tasks:
                task.workers_id.remove(user)
            return Response({'message' : 'User removed from team.'},status=status.HTTP_200_OK)
        return Response({'message' : 'User is not in team!'},status=status.HTTP_400_BAD_REQUEST)
    
    
class ChangeTaskStatusView(APIView):
    permission_classes = [CustomPersmissions]

    def post(self,request,pk,id,format=None):
        print(request.user)
        team = get_object_or_404(Team,pk=pk)
        task = get_object_or_404(Task,pk=id)
        if request.user == team.manager or (request.user in team.workers.all() and request.user in task.workers_id.all()):
            status_task = request.data.get('status')
            task.status = status_task
            task.save()
            return Response({'message' : 'Status changed.'},status=status.HTTP_200_OK) 
        return Response (status=status.HTTP_403_FORBIDDEN)
    

        
class AddingLink(APIView):
    permission_classes = [CustomPersmissions]

    def get(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        while True:
            adding_link_code = get_random_string(16)
            if not Team.objects.filter(unique_code=adding_link_code).exists():
                break
        team.adding_link_code = adding_link_code
        team.adding_link_code_expiration_time = timezone.now() + timedelta(minutes=10)
        team.save()
        link = f"http://127.0.0.1:8000/api/teams/join/{adding_link_code}/"
        return Response({'link' : link},status=status.HTTP_200_OK) 
    
