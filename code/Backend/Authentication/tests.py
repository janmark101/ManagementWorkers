from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile

class RegistrationTest(APITestCase):
    def setUp(self):
        self.client = self.client_class()
        
    def test_register(self):
        data = {"username" : "test123","email" : 'test@gmail.com',"password": "test12345",'first_name' : 'test','last_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
    
    def test_register_invalid_username(self):
        data = {"username" : "123","email" : 'test@gmail.com',"password": "test12345",'first_name' : 'test','last_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_register_invalid_password(self):
        data = {"username" : "test123","email" : 'test@gmail.com',"password": "123",'first_name' : 'test','last_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
    
    def test_register_no_firstname(self):
        data = {"username" : "test123","email" : 'test@gmail.com',"password": "test12345",'last_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_register_no_lastname(self):
        data = {"username" : "test123","email" : 'test@gmail.com',"password": "test12345",'firssst_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_register_invalid_email(self):
        data = {"username" : "test123","email" : 'testgmail.com',"password": "test12345",'first_name' : 'test','last_name' : 'test'}
        response = self.client.post('/auth/register/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
class LoginTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com',first_name='test',last_name='test')
        UserProfile.objects.create(user=self.user)
        self.client = self.client_class()
        
    def test_login_username(self):
        data = {'username' : 'test','password':'123'}
        response = self.client.post('/auth/login/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
    def test_login_invalid_credentials_username(self):
        data = {'username' : 'test123','password':'123'}
        response = self.client.post('/auth/login/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_login_invalid_credentials_password(self):
        data = {'username' : 'test','password':'12345'}
        response = self.client.post('/auth/login/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
        
class LogoutTest(APITestCase):
    def setUp(self):
        user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        token = Token.objects.create(user=user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}') 
        
    def test_logout(self):
        response = self.client.post('/auth/logout/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
class VerifyAccTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user)
        token = Token.objects.create(user=self.user)
        self.user_profile.verify_code = '123'
        self.user_profile.save()
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}') 
        
    @transaction.atomic
    def test_verify_code(self):
        data = {"verify_code": "123"}
        self.assertFalse(self.user_profile.is_verified)
        response = self.client.post('/auth/verifyacc/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.user_profile.refresh_from_db()
        self.assertTrue(self.user_profile.is_verified)
        
    @transaction.atomic
    def test_verify_code_invalid_code(self):
        data = {"verify_code": "12345"}
        self.assertFalse(self.user_profile.is_verified)
        response = self.client.post('/auth/verifyacc/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.user_profile.refresh_from_db()
        self.assertFalse(self.user_profile.is_verified)
        
class TestNoPermissionURLS(APITestCase):
    def setUp(self):
        self.client = self.client_class() 
        
    def test_post_logout_url(self):
        response = self.client.post('/auth/logout/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        
    def test_post_verifyacc_url(self):
        response = self.client.post('/auth/verifyacc/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)