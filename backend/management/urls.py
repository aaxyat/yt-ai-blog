from django.urls import path
from .views import (
    UserListView,
    UserDetailView,
    InviteCodeView,
    InviteCodeDetailView,
    UserBanView,
    StatisticsView,
)

app_name = 'management'

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path(
        'users/<str:username>/',
        UserDetailView.as_view(),
        name='user-detail'
    ),
    path('invites/', InviteCodeView.as_view(), name='invite-list'),
    path(
        'invites/<uuid:code>/',
        InviteCodeDetailView.as_view(),
        name='invite-detail'
    ),
    path('ban/', UserBanView.as_view(), name='user-ban'),
    path('stats/', StatisticsView.as_view(), name='statistics'),
] 