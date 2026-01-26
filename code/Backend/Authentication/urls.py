from django.urls import path
from . views import Login, Logout, PasswordResetConfirmView, PasswordResetRequestView ,Register, VerifyAccountView


urlpatterns = [
    path('login/',Login.as_view()),
    path('logout/',Logout.as_view()),
    path('register/',Register.as_view()),
    path('verifyacc/',VerifyAccountView.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view()),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
