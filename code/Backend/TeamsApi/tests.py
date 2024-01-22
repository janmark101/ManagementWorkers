from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from django.db import transaction
from Authentication.models import UserProfile
from .models import Task,Team
from django.db import transaction


class TeamsViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}') 

    def test_get_teams_for_user(self):
        response = self.client.get('/api/teams/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_post_create_team(self):
        data = {'name' : 'test team', 'description' : 'test'}
        response = self.client.post('/api/teams/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        
    def test_post_create_team_blank_name(self):
        data = {'name' : '', 'description' : 'test'}
        response = self.client.post('/api/teams/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
class TaskForTeamTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.team = Team.objects.create(name='test',description='test',manager=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}') 

    def test_get_task_for_team_for_manager(self):
        response = self.client.get(f'/api/teams/{self.team.id}/tasks/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_get_task_for_team_for_workers_id(self):
        response = self.client.get(f'/api/teams/{self.team.id}/tasks/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_post_new_task(self):
        data = {'name':'test','description':'test', 'date' : '2023-11-27T16:00:03Z'}
        response = self.client.post(f'/api/teams/{self.team.id}/tasks/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        
    def test_post_new_task_blank_name(self):
        data = {'name':'','description':'test', 'date' : '2023-11-27T16:00:03Z'}
        response = self.client.post(f'/api/teams/{self.team.id}/tasks/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_post_new_task_blank_description(self):
        data = {'name':'test','description':'', 'date' : '2023-11-27T16:00:03Z'}
        response = self.client.post(f'/api/teams/{self.team.id}/tasks/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_post_new_task_blank_date(self):
        data = {'name':'test','description':'tesst', 'date' : ''}
        response = self.client.post(f'/api/teams/{self.team.id}/tasks/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        

class JoinTeamTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')

        
    def test_join_team(self): 
        team = Team.objects.create(name='test',description='test',manager=self.user_2,unique_code='123')       
        data = {'unique_code' : '123'}
        response = self.client.post(f'/api/teams/join/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_join_team_invalid_code(self): 
        team = Team.objects.create(name='test',description='test',manager=self.user_2,unique_code='123')       
        data = {'unique_code' : '111'}
        response = self.client.post(f'/api/teams/join/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND) 
        
    def test_join_team_manager_team(self): 
        team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')       
        data = {'unique_code' : '123'}
        response = self.client.post(f'/api/teams/join/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST) 
        
    def test_join_team_already_in_team(self): 
        team = Team.objects.create(name='test',description='test',manager=self.user_2,unique_code='123')   
        team.workers.add(self.user)
        team.save()    
        data = {'unique_code' : '123'}
        response = self.client.post(f'/api/teams/join/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST) 

class TeamUserTesst(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
 
        
    def test_get_users_for_manager(self):
        team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')  
        response = self.client.get(f'/api/teams/{team.id}/users/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    def test_get_users_for_worker(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team = Team.objects.create(name='test',description='test',manager=user_2,unique_code='123')  
        team.workers.add(self.user)
        team.save()
        response = self.client.get(f'/api/teams/{team.id}/users/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_get_users_for_no_manager_no_worker(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team = Team.objects.create(name='test',description='test',manager=user_2,unique_code='123')  
        response = self.client.get(f'/api/teams/{team.id}/users/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)   
        
class TaskObjectTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')  
        self.task = Task.objects.create(name='test',description='test',team_id=self.team,date='2023-11-27T16:00:03Z')
        
    def test_get_task_for_manager(self):
        response = self.client.get(f'/api/teams/{self.team.id}/task/{self.task.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_get_task_for_worker_in_task(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        task_2.workers_id.add(self.user)
        response = self.client.get(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_get_task_for_worker_not_in_task(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.get(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_task_for_worker_not_in_team(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.get(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_task(self):
        response = self.client.delete(f'/api/teams/{self.team.id}/task/{self.task.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_delete_task_worker_in_team_not_in_task(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.delete(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_task_worker_in_team_in_task(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        task_2.workers_id.add(self.user)
        response = self.client.delete(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_task_worker_not_in_team(self):
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.delete(f'/api/teams/{team_2.id}/task/{task_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    @transaction.atomic
    def test_put_task(self):
        data = { 'name' : 'test_put','description' : 'test','date': '2023-11-27T16:00:03Z'}
        response = self.client.put(f'/api/teams/{self.team.id}/task/{self.task.id}/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual('test_put',self.task.name)
        
    @transaction.atomic
    def test_put_task_worker_in_team_not_in_task(self):
        data = { 'name' : 'test_put','description' : 'test','date': '2023-11-27T16:00:03Z'}
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.put(f'/api/teams/{team_2.id}/task/{task_2.id}/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.task.refresh_from_db()
        self.assertNotEqual('test_put',task_2.name)
        
    @transaction.atomic
    def test_put_task_worker_in_team_in_task(self):
        data = { 'name' : 'test_put','description' : 'test','date': '2023-11-27T16:00:03Z'}
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        team_2.workers.add(self.user)
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        task_2.workers_id.add(self.user)
        response = self.client.put(f'/api/teams/{team_2.id}/task/{task_2.id}/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.task.refresh_from_db()
        self.assertNotEqual('test_put',task_2.name)
        
    @transaction.atomic
    def test_put_task_worker_not_in_team(self):
        data = { 'name' : 'test_put','description' : 'test','date': '2023-11-27T16:00:03Z'}
        user_2 = User.objects.create(username='test_2',password='123',email='test_2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234')
        task_2 = Task.objects.create(name='test',description='test',team_id=team_2,date='2023-11-27T16:00:03Z')
        response = self.client.put(f'/api/teams/{team_2.id}/task/{task_2.id}/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.task.refresh_from_db()
        self.assertNotEqual('test_put',task_2.name)
    
class TeamCodeTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')  
        
    def test_get_unique_code_for_manager(self):
        response = self.client.get(f'/api/teams/{self.team.id}/uniquecode/',format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual('123',response.data['code'])
        
    def test_get_unique_code_for_worker_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(self.user) 
        response = self.client.get(f'/api/teams/{team_2.id}/uniquecode/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_get_unique_code_for_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        response = self.client.get(f'/api/teams/{team_2.id}/uniquecode/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_change_code_manager(self):
        response = self.client.post(f'/api/teams/{self.team.id}/uniquecode/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_change_code_for_worker_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(self.user) 
        response = self.client.post(f'/api/teams/{team_2.id}/uniquecode/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_change_code_for_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        response = self.client.post(f'/api/teams/{team_2.id}/uniquecode/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
class TeamObjectTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')  
    
    def test_leave_team_manager(self):
        response = self.client.post(f'/api/teams/{self.team.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_leave_team_worker_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(self.user) 
        response = self.client.post(f'/api/teams/{team_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_leave_team_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        response = self.client.post(f'/api/teams/{team_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_delete_team_manager(self):
        response = self.client.delete(f'/api/teams/{self.team.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_204_NO_CONTENT)
        
    def test_delete_team_worker_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(self.user) 
        response = self.client.delete(f'/api/teams/{team_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_team_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        response = self.client.delete(f'/api/teams/{team_2.id}/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
class RemoveUserFromTeamTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123')  
    
    def test_reamove_user_manager(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        self.team.workers.add(user_2)
        response = self.client.post(f'/api/teams/{self.team.id}/removeuser/{user_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    def test_leave_team_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        response = self.client.post(f'/api/teams/{self.team.id}/removeuser/{user_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        
    def test_reamove_user_as_worker_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(self.user,user_2) 
        response = self.client.post(f'/api/teams/{team_2.id}/removeuser/{user_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_remove_user_as_worker_not_in_team(self):
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team_2 = Team.objects.create(name='test',description='test',manager=user_2,unique_code='1234') 
        team_2.workers.add(user_2) 
        response = self.client.post(f'/api/teams/{team_2.id}/removeuser/{user_2.id}/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
class ChangeTaskStatusView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=True)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        
    @transaction.atomic  
    def test_post_change_status_manager(self):
        data = {'status' : 'In progres'}
        team = Team.objects.create(name='test',description='test',manager=self.user,unique_code='123') 
        task_2 = Task.objects.create(name='test',description='test',team_id=team,date='2023-11-27T16:00:03Z')
        response = self.client.post(f'/api/teams/{team.id}/task/{task_2.id}/changestatus/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        task_2.refresh_from_db()
        self.assertEqual('In progres',task_2.status)
        
    @transaction.atomic  
    def test_post_change_status_worker_in_team_in_task(self):
        data = {'status' : 'In progres'}
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team = Team.objects.create(name='test',description='test',manager=user_2,unique_code='123')
        task_2 = Task.objects.create(name='test',description='test',team_id=team,date='2023-11-27T16:00:03Z')
        team.workers.add(self.user)
        task_2.workers_id.add(self.user)
        response = self.client.post(f'/api/teams/{team.id}/task/{task_2.id}/changestatus/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        task_2.refresh_from_db()
        self.assertEqual('In progres',task_2.status)
        
    @transaction.atomic  
    def test_post_change_status_worker_not_in_team(self):
        data = {'status' : 'In progres'}
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team = Team.objects.create(name='test',description='test',manager=user_2,unique_code='123')
        task_2 = Task.objects.create(name='test',description='test',team_id=team,date='2023-11-27T16:00:03Z')
        response = self.client.post(f'/api/teams/{team.id}/task/{task_2.id}/changestatus/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        task_2.refresh_from_db()
        self.assertNotEqual('In progres',task_2.status)
        
    @transaction.atomic  
    def test_post_change_status_worker_in_team_not_in_task(self):
        data = {'status' : 'In progres'}
        user_2 = User.objects.create_user(username='test2',password='123',email='test2@gmail.com')
        team = Team.objects.create(name='test',description='test',manager=user_2,unique_code='123')
        task_2 = Task.objects.create(name='test',description='test',team_id=team,date='2023-11-27T16:00:03Z')
        team.workers.add(self.user)
        response = self.client.post(f'/api/teams/{team.id}/task/{task_2.id}/changestatus/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        task_2.refresh_from_db()
        self.assertNotEqual('In progres',task_2.status)
        

        
        
class TestPermissionsNotLoggedURLS(APITestCase):
    def setUp(self):
        self.client = self.client_class() 
        
    def test_post_teams_url(self):
        response = self.client.post('/api/teams/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_url(self):
        response = self.client.get('/api/teams/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_tasks_url(self):
        response = self.client.get('/api/teams/1/tasks/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_tasks_url(self):
        response = self.client.post('/api/teams/1/tasks/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_join_url(self):
        response = self.client.post('/api/teams/join/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_users_url(self):
        response = self.client.get('/api/teams/1/users/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_task_taskid_url(self):
        response = self.client.get('/api/teams/1/task/1/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    
    def test_delete_teams_teamid_task_taskid_url(self):
        response = self.client.delete('/api/teams/1/task/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_put_teams_teamid_task_taskid_url(self):
        response = self.client.put('/api/teams/1/task/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_uniquecode_url(self):
        response = self.client.post('/api/teams/1/uniquecode/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_uniquecode_url(self):
        response = self.client.get('/api/teams/1/uniquecode/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_url(self):
        response = self.client.post('/api/teams/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_teams_teamid_url(self):
        response = self.client.delete('/api/teams/1/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_removeuser_userid_url(self):
        response = self.client.post('/api/teams/1/removeuser/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_task_taskid_changestatus_url(self):
        response = self.client.post('/api/teams/1/task/1/changestatus/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    

        
        
class TestPermissionsNotVerifiedURLS(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test',password='123',email='test@gmail.com')
        self.user_profile = UserProfile.objects.create(user=self.user,is_verified=False)
        token = Token.objects.create(user=self.user)
        self.client = self.client_class(HTTP_AUTHORIZATION=f'Token {token.key}')
        
    def test_post_teams_url(self):
        response = self.client.post('/api/teams/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_url(self):
        response = self.client.get('/api/teams/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_tasks_url(self):
        response = self.client.get('/api/teams/1/tasks/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_tasks_url(self):
        response = self.client.post('/api/teams/1/tasks/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_join_url(self):
        response = self.client.post('/api/teams/join/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_users_url(self):
        response = self.client.get('/api/teams/1/users/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_task_taskid_url(self):
        response = self.client.get('/api/teams/1/task/1/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    
    def test_delete_teams_teamid_task_taskid_url(self):
        response = self.client.delete('/api/teams/1/task/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_put_teams_teamid_task_taskid_url(self):
        response = self.client.put('/api/teams/1/task/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_uniquecode_url(self):
        response = self.client.post('/api/teams/1/uniquecode/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_get_teams_teamid_uniquecode_url(self):
        response = self.client.get('/api/teams/1/uniquecode/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_url(self):
        response = self.client.post('/api/teams/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_delete_teams_teamid_url(self):
        response = self.client.delete('/api/teams/1/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_removeuser_userid_url(self):
        response = self.client.post('/api/teams/1/removeuser/1/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        
    def test_post_teams_teamid_task_taskid_changestatus_url(self):
        response = self.client.post('/api/teams/1/task/1/changestatus/',None,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
    
