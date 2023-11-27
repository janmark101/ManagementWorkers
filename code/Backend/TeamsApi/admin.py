from django.contrib import admin
from .models import Team, Task


class TeamsAdmin(admin.ModelAdmin):
    filter_horizontal = ('workers',) 

class TaskAdmin(admin.ModelAdmin):
    filter_horizontal = ('workers_id',) 


admin.site.register(Task,TaskAdmin)
admin.site.register(Team,TeamsAdmin)