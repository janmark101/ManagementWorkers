from django.contrib import admin
from .models import Team


class TeamsAdmin(admin.ModelAdmin):
    filter_horizontal = ('workers',) 
# Register your models here.

admin.site.register(Team,TeamsAdmin)