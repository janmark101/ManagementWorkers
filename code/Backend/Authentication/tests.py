from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User



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
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
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