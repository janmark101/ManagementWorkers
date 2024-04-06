from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import TeamsView, TasksForTeamView, JoinTeamView, TeamUsersView, TaskObjectView, TeamCodeObject,TeamObjectView, RemoveUserFromTeamView, ChangeTaskStatusView \
    , TeamNameView, AddingLink

urlpatterns = [
    path('teams/',TeamsView.as_view()),
    path('teams/<int:id>/tasks/',TasksForTeamView.as_view()),
    path('teams/join/<str:code>/',JoinTeamView.as_view()),
    path('teams/<int:pk>/name/',TeamNameView.as_view()),
    path('teams/<int:pk>/users/', TeamUsersView.as_view()),
    path('teams/<int:pk>/task/<int:id>/', TaskObjectView.as_view()),
    path('teams/<int:pk>/uniquecode/', TeamCodeObject.as_view()),
    path('teams/<int:pk>/',TeamObjectView.as_view()),
    path('teams/<int:pk>/addinglink/',AddingLink.as_view()),
    path('teams/<int:pk>/removeuser/<int:id>/',RemoveUserFromTeamView.as_view()),
    path('teams/<int:pk>/task/<int:id>/changestatus/',ChangeTaskStatusView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)