from django.urls import path
from . views import Login, Logout,Register, VerifyAccountView


urlpatterns = [
    path('login/',Login.as_view()),
    path('logout/',Logout.as_view()),
    path('register/',Register.as_view()),
    path('verifyacc/',VerifyAccountView.as_view())
]
