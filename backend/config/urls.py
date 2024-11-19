from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

# Documentation endpoints
docs_patterns = [
    path(
        "schema/",
        SpectacularAPIView.as_view(
            authentication_classes=[],
            permission_classes=[],
            renderer_classes=[JSONRenderer, BrowsableAPIRenderer],
        ),
        name="schema",
    ),
    path(
        "docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),
    # API endpoints without namespace
    path("api/blog/", include("api.urls")),  # Blog endpoints
    path("api/auth/", include("accounts.urls")),  # Auth endpoints
    path("api/management/", include("management.urls")),  # Admin endpoints
    # Documentation
    *docs_patterns,
]
