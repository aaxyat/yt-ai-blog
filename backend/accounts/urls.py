from django.urls import path
from .views import (
    RegisterView,
    DecoratedTokenObtainPairView,
    DecoratedTokenRefreshView,
    ChangePasswordView,
    UpdateThemeView,
    DeleteAccountView,
)

urlpatterns = [
    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),
    path(
        'token/',
        DecoratedTokenObtainPairView.as_view(),
        name='token_obtain'
    ),
    path(
        'token/refresh/',
        DecoratedTokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'password/change/',
        ChangePasswordView.as_view(),
        name='change_password'
    ),
    path('theme/', UpdateThemeView.as_view(), name='update_theme'),
    path(
        'delete-account/',
        DeleteAccountView.as_view(),
        name='delete_account'
    ),
] 