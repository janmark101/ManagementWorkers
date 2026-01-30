from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import FCMDevice

@admin.register(FCMDevice)
class FCMDeviceAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'active', 'short_token', 'created_at')
    list_filter = ('active', 'type', 'created_at')
    search_fields = ('user__username', 'user__email', 'registration_id')

    def short_token(self, obj):
        return obj.registration_id[:20] + "..." if obj.registration_id else "-"
    short_token.short_description = 'Token (fragment)'