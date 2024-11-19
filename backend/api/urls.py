from django.urls import path
from .views import (
    GenerateBlogView,
    BlogListView,
    BlogDeleteView,
    BlogDetailView
)

app_name = 'api'

urlpatterns = [
    path(
        'generate-from-youtube/',
        GenerateBlogView.as_view(),
        name='generate-blog'
    ),
    path(
        'my-blogs/',
        BlogListView.as_view(),
        name='blog-list'
    ),
    path(
        'my-blogs/<int:pk>/',
        BlogDetailView.as_view(),
        name='blog-detail'
    ),
    path(
        'my-blogs/<int:pk>/delete/',
        BlogDeleteView.as_view(),
        name='blog-delete'
    ),
] 