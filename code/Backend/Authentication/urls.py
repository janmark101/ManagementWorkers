from django.urls import path
from . views import Login, Logout,Register


urlpatterns = [
    path('login/',Login.as_view()),
    path('logout/',Logout.as_view()),
    path('register/',Register.as_view()),
]
