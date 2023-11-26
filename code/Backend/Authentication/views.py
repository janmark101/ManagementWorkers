from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status, generics
from django.contrib.auth import authenticate, logout
from .serializers import UserSerializer

class Login(APIView):
    permission_classes=()
    
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if username is None or password is None: 
            return Response({'error' : 'You must insert username and password!'},status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username,password=password)

        if not user:
            return Response({'error' : 'Invalid credentials!'},status=status.HTTP_400_BAD_REQUEST)
        
        
        token,created = Token.objects.get_or_create(user=user)
        
        return Response({'message' : 'Logged in succesfully!','token' : token.key,'user_id':user.id,'firstname' : user.first_name,'lastname': user.last_name}, status=status.HTTP_200_OK)

class Logout(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    
    def post(self,request):
        auth_token = request.META.get('HTTP_AUTHORIZATION')
        token_key = auth_token.split(' ')[1]
        
        try :
            token = Token.objects.get(key=token_key)
            token.delete()
            logout(request)
            return Response({'message':'Logged out succesfully!'},status=status.HTTP_200_OK)
        except Token.DoesNotExists:
            pass
        return Response({'error':'Something went wrong!'},status=status.HTTP_400_BAD_REQUEST)   
    
class Register(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = UserSerializer 
    #dodac przy rejetrowaniu podawanie imienia i nazwiska