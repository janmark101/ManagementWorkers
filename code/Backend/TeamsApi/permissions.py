from rest_framework import permissions
from rest_framework.authtoken.models import Token
from Authentication.models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

class CustomPersmissions(permissions.BasePermission):
    def has_object_permission(self,request,view,object):
        if request.method in ['DELETE','PATCH','POST']:
            return request.user == object.manager
            
        
    def has_permission(self,request,view):
        if request.user.is_anonymous:
            message = "You need to log in first!."
            raise PermissionDenied(detail=message)
        user_profile = get_object_or_404(UserProfile,user=request.user)
        
        if user_profile.is_verified: 
            return True
        
        message = "Your account is not active. Please verify your account."
        raise PermissionDenied(detail=message)
    
            