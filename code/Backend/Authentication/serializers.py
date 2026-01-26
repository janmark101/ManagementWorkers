from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

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
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=8)
    token = serializers.CharField()
    uidb64 = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get('token')
        uidb64 = attrs.get('uidb64')

        try:
            decoded_uid = urlsafe_base64_decode(uidb64)
            uid = force_str(decoded_uid)
            user = User.objects.get(pk=uid)
            
        except (TypeError, ValueError, OverflowError) as e:
            print(f"Decoding error: {e}")
            raise serializers.ValidationError({"uidb64": ["Błąd dekodowania base64"]})
        except User.DoesNotExist:
            print(f"No such user: {uid}")
            raise serializers.ValidationError({"uidb64": ["Użytkownik nie istnieje"]})

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": ["Token is invalid or expired"]})

        attrs['user'] = user
        return attrs

    def save(self):
        password = self.validated_data['password']
        user = self.validated_data['user']
        user.set_password(password)
        user.save()
        return user