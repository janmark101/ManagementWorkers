from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth import authenticate, logout
from .serializers import UserSerializer
from .models import UserProfile
from .emails import send_verify_email


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
        
        user_profile = get_object_or_404(UserProfile,user=user)
        token,created = Token.objects.get_or_create(user=user)
        
        return Response({'message' : 'Logged in succesfully!','token' : token.key,'user_id':user.id,'firstname' : user.first_name,'lastname': user.last_name, 'verified' : user_profile.is_verified}, status=status.HTTP_200_OK)

class Logout(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    
    def post(self,request):
        token = get_object_or_404(Token,user=request.user)
        token.delete()
        logout(request)
        return Response({'message':'Logged out succesfully!'},status=status.HTTP_200_OK)
  
        
class Register(APIView):
    authentication_classes = ()
    permission_classes = ()
    
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            UserProfile.objects.create(user=user)
            send_verify_email(serializer.data['email'])
            return Response ({'message' : 'Registered succesfully.'},status=status.HTTP_201_CREATED)
        return Response ({'error' : serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    
class VerifyAccountView(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    
    def post(self,request):
        code = request.data.get('verify_code')
        user_profile = get_object_or_404(UserProfile,user=request.user)
        if user_profile.verify_code == code:
            user_profile.is_verified = True
            user_profile.verify_code = ''
            user_profile.save()
            return Response({'message':'Your account has been activated!'},status=status.HTTP_200_OK)  
        return Response({'error':'Wrong code! Try again.'},status=status.HTTP_400_BAD_REQUEST)  
        