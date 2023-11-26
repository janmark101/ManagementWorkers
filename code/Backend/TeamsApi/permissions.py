from rest_framework import permissions
from rest_framework.authtoken.models import Token


class CustomPersmissions(permissions.BasePermission):
    def user(self,request):
        auth_token = request.META.get('HTTP_AUTHORIZATION')
        if not auth_token:
            return False
        token_key = auth_token.split(' ')[1]
        token = Token.objects.get(key=token_key)
        
        return token.user
    
    def has_object_permission(self,request,view,object):
        if request.method in ['DELETE','PATCH']:
            
            user_id = self.user(request)
            return user_id == object.manager
        
    def has_permission(self,request,view):
        if request.method == ['GET','POST']:
            auth_token = request.META.get('HTTP_AUTHORIZATION')
            if not auth_token:
                return False
            return True
        return True