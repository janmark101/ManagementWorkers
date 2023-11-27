from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import TeamsView, TasksForTeamView

urlpatterns = [
    path('teams/',TeamsView.as_view()),
    path('teams/<int:id>/tasks/',TasksForTeamView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)