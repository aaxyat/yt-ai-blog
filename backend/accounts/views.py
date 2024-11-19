from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    TokenObtainPairResponseSerializer,
    TokenRefreshResponseSerializer,
    ChangePasswordSerializer,
    UpdateThemeSerializer,
)

User = get_user_model()


class RegisterView(APIView):
    @extend_schema(
        tags=["Authentication"],
        request=UserSerializer,
        responses={
            201: UserSerializer,
            400: OpenApiResponse(description="Invalid input"),
        },
        description="Register a new user account",
        summary="Register new user",
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["User Management"],
        request=ChangePasswordSerializer,
        responses={
            200: OpenApiResponse(description="Password changed successfully"),
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Authentication failed"),
        },
        description="Change user's password",
        summary="Change password",
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data['old_password']):
                user.set_password(serializer.data['new_password'])
                user.save()
                return Response(
                    {"message": "Password changed successfully"},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"error": "Incorrect old password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateThemeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["User Management"],
        request=UpdateThemeSerializer,
        responses={
            200: UpdateThemeSerializer,
            400: OpenApiResponse(description="Invalid input"),
            401: OpenApiResponse(description="Authentication failed"),
        },
        description="Update user's UI theme preference",
        summary="Update UI theme",
    )
    def post(self, request):
        serializer = UpdateThemeSerializer(data=request.data)
        if serializer.is_valid():
            profile = request.user.profile
            profile.ui_theme = serializer.validated_data['ui_theme']
            profile.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["User Management"],
        responses={
            204: OpenApiResponse(description="Account deleted successfully"),
            401: OpenApiResponse(description="Authentication failed"),
        },
        description="Permanently delete user account and all associated data",
        summary="Delete account",
    )
    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DecoratedTokenObtainPairView(TokenObtainPairView):
    @extend_schema(
        tags=["Authentication"],
        responses={
            200: TokenObtainPairResponseSerializer,
            401: OpenApiResponse(description="Invalid credentials"),
        },
        description=(
            "Takes a set of user credentials and returns an access token, "
            "refresh token, and user data including roles"
        ),
        summary="Get JWT token pair and user data",
    )
    def post(self, request, *args, **kwargs):
        # First get the token response
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Get the user from the token
            token = response.data.get('access')
            if token:
                from rest_framework_simplejwt.tokens import AccessToken
                user_id = AccessToken(token)['user_id']
                user = User.objects.get(id=user_id)
                # Add user data to response
                response.data['user'] = UserSerializer(user).data
        
        return response


class DecoratedTokenRefreshView(TokenRefreshView):
    @extend_schema(
        tags=["Authentication"],
        responses={
            200: TokenRefreshResponseSerializer,
            401: OpenApiResponse(description="Invalid token"),
        },
        description="Takes a refresh token and returns a new access token",
        summary="Refresh access token",
        operation_id="token_refresh",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
