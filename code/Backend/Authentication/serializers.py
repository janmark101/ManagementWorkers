from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','first_name','last_name','password')
        extra_kwargs = {'password': {'write_only': True}}
        
        
    def validate_username(self,value):
        if len(value) < 5 :
            raise serializers.ValidationError('Username must be at least 5 characters long!')
        if value.isdigit():
            raise serializers.ValidationError('Username can not consist of only digits.')
        return value
    
    def validate_password(self,value):
        validate_password(value)
        return value
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already in use!')
        return value
    
    def validate(self,validated_data):
        if not validated_data.get('first_name'): 
            raise serializers.ValidationError('First name is required')
        if not validated_data.get('last_name'): 
            raise serializers.ValidationError('Last name is required')
        return validated_data
    
    def create(self,validated_data):
        user = User(email=validated_data['email'],username=validated_data['username'],first_name=validated_data["first_name"],last_name=validated_data["last_name"])
        user.set_password(validated_data['password'])
        user.save()
        return user