from django.contrib import admin
from django.utils import timezone
from .models import InviteCode, InviteCodeUsage, UserBan


@admin.register(InviteCode)
class InviteCodeAdmin(admin.ModelAdmin):
    list_display = [
        'code',
        'created_by',
        'max_uses',
        'uses',
        'is_active',
        'is_valid',
        'created_at',
        'expires_at',
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['code', 'created_by__email']
    readonly_fields = ['code', 'created_at', 'uses']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def is_valid(self, obj):
        return obj.is_valid
    is_valid.boolean = True
    is_valid.short_description = "Valid"


@admin.register(InviteCodeUsage)
class InviteCodeUsageAdmin(admin.ModelAdmin):
    list_display = [
        'invite_code',
        'user',
        'used_at',
    ]
    list_filter = ['used_at']
    search_fields = [
        'invite_code__code',
        'user__email',
    ]
    readonly_fields = ['used_at']


@admin.register(UserBan)
class UserBanAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'banned_by',
        'reason',
        'banned_at',
        'expires_at',
        'is_active',
    ]
    list_filter = ['banned_at']
    search_fields = [
        'user__email',
        'banned_by__email',
        'reason',
    ]
    readonly_fields = ['banned_at']

    def is_active(self, obj):
        if obj.expires_at and obj.expires_at < timezone.now():
            return False
        return True
    is_active.boolean = True
    is_active.short_description = "Active"
