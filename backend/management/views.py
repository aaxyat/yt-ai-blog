from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveDestroyAPIView,
)
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count, F
from datetime import datetime
from dateutil.relativedelta import relativedelta

from api.models import BlogPost
from .models import InviteCode, UserBan, InviteCodeUsage
from .serializers import (
    AdminUserSerializer,
    CreateUserSerializer,
    InviteCodeSerializer,
    InviteCodeDetailSerializer,
    UserBanSerializer,
    StatisticsSerializer,
)

User = get_user_model()


class UserListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()

    @extend_schema(
        tags=["Admin"],
        responses={
            200: AdminUserSerializer(many=True),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
        },
        description="List all users (admin only)",
        summary="List users",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Admin"],
        request=CreateUserSerializer,
        responses={
            201: AdminUserSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
        },
        description="Create a new user (admin only)",
        summary="Create user",
    )
    def post(self, request, *args, **kwargs):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                AdminUserSerializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    @extend_schema(
        tags=["Admin"],
        responses={
            200: AdminUserSerializer,
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
            404: OpenApiResponse(description="User not found"),
        },
        description="Get user details (admin only)",
        summary="Get user details",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Admin"],
        responses={
            204: OpenApiResponse(description="User deleted successfully"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
            404: OpenApiResponse(description="User not found"),
        },
        description="Delete user account (admin only)",
        summary="Delete user",
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class InviteCodeView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = InviteCodeSerializer
    queryset = InviteCode.objects.all()

    @extend_schema(
        tags=["Admin"],
        responses={
            200: InviteCodeSerializer(many=True),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
        },
        description="List all invite codes (admin only)",
        summary="List invite codes",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Admin"],
        request=InviteCodeSerializer,
        responses={
            201: InviteCodeSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
        },
        description="Create new invite code (admin only)",
        summary="Create invite code",
    )
    def post(self, request, *args, **kwargs):
        serializer = InviteCodeSerializer(data=request.data)
        if serializer.is_valid():
            invite = serializer.save(created_by=request.user)
            return Response(
                InviteCodeSerializer(invite).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserBanView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserBanSerializer

    @extend_schema(
        tags=["Admin"],
        request=UserBanSerializer,
        responses={
            201: UserBanSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
        },
        description="Ban a user (admin only)",
        summary="Ban user",
    )
    def post(self, request, *args, **kwargs):
        serializer = UserBanSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            ban = serializer.save()
            return Response(UserBanSerializer(ban).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InviteCodeDetailView(RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = InviteCodeDetailSerializer
    queryset = InviteCode.objects.all()
    lookup_field = 'code'

    @extend_schema(
        tags=["Admin"],
        responses={
            200: InviteCodeDetailSerializer,
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
            404: OpenApiResponse(description="Invite code not found"),
        },
        description=(
            "Get detailed information about an invite code, including a list "
            "of users who used it to register"
        ),
        summary="Get invite code details",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Admin"],
        responses={
            204: OpenApiResponse(
                description="Invite code deleted successfully"
            ),
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized"),
            404: OpenApiResponse(description="Invite code not found"),
        },
        description="Delete an invite code",
        summary="Delete invite code",
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class IsSuperUser(IsAuthenticated):
    """Custom permission to only allow superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_superuser
        )


class StatisticsView(APIView):
    permission_classes = [IsSuperUser]

    @extend_schema(
        tags=["Admin"],
        responses={
            200: StatisticsSerializer,
            401: OpenApiResponse(description="Not authenticated"),
            403: OpenApiResponse(description="Not authorized - Superuser only"),
        },
        description="Get system statistics and metrics (Superuser only)",
        summary="System Statistics",
    )
    def get(self, request):
        # Get current time and first day of month
        now = timezone.now()
        month_start = now.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )

        # Calculate statistics
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'total_blogs': BlogPost.objects.count(),
            'active_invites': InviteCode.objects.filter(
                is_active=True,
                expires_at__gt=now
            ).count(),
            'blogs_this_month': BlogPost.objects.filter(
                created_at__gte=month_start
            ).count(),
            'users_this_month': User.objects.filter(
                date_joined__gte=month_start
            ).count(),
            'invite_usage': self._get_invite_usage()
        }

        return Response(StatisticsSerializer(stats).data)

    def _get_invite_usage(self):
        """Get invite code usage statistics"""
        invites = InviteCode.objects.all()
        total_invites = invites.count()
        used_invites = invites.filter(uses__gt=0).count()
        expired_invites = invites.filter(
            expires_at__lt=timezone.now()
        ).count()

        return {
            'total': total_invites,
            'used': used_invites,
            'expired': expired_invites,
            'available': InviteCode.objects.filter(
                is_active=True,
                uses__lt=F('max_uses'),
                expires_at__gt=timezone.now()
            ).count()
        }
