from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','email','first_name','last_name','password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self,validated_data):
        if 'email' not in validated_data:
            return serializers.ValidationError("Please insert Email!")
        
        user = User(email=validated_data['email'],username=validated_data['username'],first_name=validated_data["first_name"],last_name=validated_data["last_name"])
        user.set_password(validated_data['password'])
        user.save()
        return user