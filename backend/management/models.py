from django.conf import settings
from django.db import models
from django.utils import timezone
import random
import string


def generate_invite_code():
    """Generate a random 8-character invite code"""
    chars = string.ascii_uppercase + string.digits  # A-Z and 0-9
    while True:
        code = ''.join(random.choices(chars, k=8))
        # Check if code already exists
        if not InviteCode.objects.filter(code=code).exists():
            return code


class InviteCode(models.Model):
    code = models.CharField(
        max_length=8,
        default=generate_invite_code,
        editable=False,
        unique=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_invites'
    )
    max_uses = models.PositiveIntegerField(default=1)
    uses = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"Invite {self.code} ({self.uses}/{self.max_uses})"

    @property
    def is_valid(self):
        """Check if invite code is still valid"""
        if not self.is_active:
            return False
        if self.uses >= self.max_uses:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True


class InviteCodeUsage(models.Model):
    invite_code = models.ForeignKey(
        InviteCode,
        on_delete=models.CASCADE,
        related_name='usages'
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='invite_usage'
    )
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-used_at']
        indexes = [
            models.Index(fields=['used_at']),
        ]

    def __str__(self):
        return f"{self.user.username} used {self.invite_code.code}"


class UserBan(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ban'
    )
    banned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='banned_users'
    )
    reason = models.TextField()
    banned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-banned_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['banned_at']),
        ]

    def __str__(self):
        return f"{self.user.username} banned by {self.banned_by.username}"

    @property
    def is_active(self):
        """Check if ban is still active"""
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True
