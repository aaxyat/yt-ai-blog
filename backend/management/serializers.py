from rest_framework import serializers
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field
from typing import Optional, Dict, Any
from .models import InviteCode, UserBan, InviteCodeUsage

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    is_banned = serializers.SerializerMethodField()
    ban_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
            'last_login',
            'is_banned',
            'ban_info',
        ]
        read_only_fields = [
            'date_joined',
            'last_login',
            'is_banned',
            'ban_info',
        ]

    @extend_schema_field(bool)
    def get_is_banned(self, obj: User) -> bool:
        return hasattr(obj, 'ban') and obj.ban.is_active

    @extend_schema_field(
        {
            "type": "object",
            "properties": {
                "reason": {"type": "string"},
                "banned_at": {"type": "string", "format": "date-time"},
                "expires_at": {
                    "type": "string",
                    "format": "date-time",
                    "nullable": True
                },
            },
            "nullable": True,
        }
    )
    def get_ban_info(self, obj: User) -> Optional[Dict[str, Any]]:
        if hasattr(obj, 'ban') and obj.ban.is_active:
            return {
                'reason': obj.ban.reason,
                'banned_at': obj.ban.banned_at,
                'expires_at': obj.ban.expires_at,
            }
        return None


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    invite_code = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'invite_code',
        ]

    def validate_invite_code(self, value):
        try:
            invite = InviteCode.objects.get(code=value.upper())
            if not invite.is_valid:
                raise serializers.ValidationError(
                    "This invite code is no longer valid"
                )
            return value
        except InviteCode.DoesNotExist:
            raise serializers.ValidationError("Invalid invite code")

    def create(self, validated_data):
        invite_code = validated_data.pop('invite_code')
        invite = InviteCode.objects.get(code=invite_code)
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Create invite code usage record
        InviteCodeUsage.objects.create(
            invite_code=invite,
            user=user
        )

        # Update invite code usage count
        invite.uses += 1
        invite.save()

        return user


class InviteCodeSerializer(serializers.ModelSerializer):
    code = serializers.UUIDField(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = InviteCode
        fields = [
            'id',
            'code',
            'created_by',
            'max_uses',
            'uses',
            'is_active',
            'created_at',
            'expires_at',
            'is_valid',
        ]
        read_only_fields = ['uses', 'created_at']


class UserBanSerializer(serializers.ModelSerializer):
    banned_by = serializers.StringRelatedField(read_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = UserBan
        fields = [
            'email',
            'reason',
            'banned_by',
            'banned_at',
            'expires_at',
        ]
        read_only_fields = ['banned_at']

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_superuser:
                raise serializers.ValidationError(
                    "Cannot ban superuser accounts"
                )
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

    def create(self, validated_data):
        email = validated_data.pop('email')
        user = User.objects.get(email=email)
        
        # Create or update ban
        ban, _ = UserBan.objects.update_or_create(
            user=user,
            defaults={
                'banned_by': self.context['request'].user,
                **validated_data
            }
        )
        
        # Deactivate user account
        user.is_active = False
        user.save()
        
        return ban 


class InviteCodeUsageSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = InviteCodeUsage
        fields = [
            'email',
            'used_at',
        ]


class InviteCodeDetailSerializer(serializers.ModelSerializer):
    code = serializers.UUIDField(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    usages = InviteCodeUsageSerializer(many=True, read_only=True)

    class Meta:
        model = InviteCode
        fields = [
            'id',
            'code',
            'created_by',
            'max_uses',
            'uses',
            'is_active',
            'created_at',
            'expires_at',
            'is_valid',
            'usages',
        ]
        read_only_fields = ['uses', 'created_at'] 


class StatisticsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_blogs = serializers.IntegerField()
    active_invites = serializers.IntegerField()
    blogs_this_month = serializers.IntegerField()
    users_this_month = serializers.IntegerField()
    invite_usage = serializers.DictField() 