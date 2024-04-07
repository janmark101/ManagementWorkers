from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import CustomPermissions
from .models import TeamMessage
from rest_framework import status
from .serializers import TeamMessageSerializer
from django.shortcuts import get_object_or_404
from TeamsApi.models import Team


class TeamMessagesView(APIView):
    permission_classes=[CustomPermissions]
    
    def get(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        messages = TeamMessage.objects.filter(team=pk)
        serializer = TeamMessageSerializer(messages,many=True)
        return Response({'message' : serializer.data},status=status.HTTP_200_OK)
    
    def post(self,request,pk,format=None):
        team = get_object_or_404(Team,pk=pk)
        self.check_object_permissions(request,team)
        serializer = TeamMessageSerializer(data=request.data, context={'user': request.user,'team' : team})

        if serializer.is_valid():
            serializer.save()
            return Response({"message" : 'Message sent!'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)