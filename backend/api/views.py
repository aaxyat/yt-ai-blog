from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListAPIView,
    DestroyAPIView,
    RetrieveAPIView
)
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.conf import settings
from django.shortcuts import redirect, get_object_or_404

from .models import BlogPost
from .serializers import (
    BlogRequestSerializer,
    BlogResponseSerializer,
    BlogListSerializer
)
from .services import BlogGenerator


def api_root_redirect(request):
    """Redirect API root to API documentation"""
    return redirect('swagger-ui')


class GenerateBlogView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Blog Generation"],
        request=BlogRequestSerializer,
        responses={
            200: BlogResponseSerializer,
            400: OpenApiResponse(
                description="Invalid input",
                response={"type": "object"}
            ),
            401: OpenApiResponse(description="Authentication failed"),
            500: OpenApiResponse(
                description="Server error",
                response={"type": "object"}
            )
        },
        description=(
            "Generate a blog post from a YouTube video. If a blog post exists "
            "and regen=true, it will overwrite the existing post."
        ),
        summary="Generate blog post from YouTube video",
    )
    def post(self, request):
        serializer = BlogRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        url = serializer.validated_data["url"]
        regen = serializer.validated_data["regen"]

        # Check for existing blog post
        existing_post = BlogPost.objects.filter(
            youtube_url=url,
            user=request.user
        ).first()
        
        if existing_post and not regen:
            return Response(BlogResponseSerializer(existing_post).data)

        try:
            generator = BlogGenerator(settings.OPENAI_API_KEY)
            
            # Get video info and generate blog
            video_info = generator.get_video_info(url)
            transcript = generator.get_transcript(video_info['video_id'])
            blog_data = generator.generate_blog(
                transcript,
                video_info['title']
            )

            # Always use update_or_create
            blog_post, _ = BlogPost.objects.update_or_create(
                youtube_url=url,
                user=request.user,
                defaults={
                    'youtube_title': video_info['title'],
                    'blog_title': blog_data['title'],
                    'content': blog_data['content'],
                    'author_name': (
                        f"{request.user.first_name} "
                        f"{request.user.last_name}".strip() or
                        request.user.email
                    )
                }
            )

            return Response(BlogResponseSerializer(blog_post).data)

        except ValueError as e:
            # Log the detailed error for debugging
            print(f"Blog Generation Error: {str(e)}")
            return Response(
                {"error": "Error generating blog post"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Log the detailed error for debugging
            print(f"Unexpected Error: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BlogListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogListSerializer

    @extend_schema(
        tags=["Blog Posts"],
        responses={
            200: BlogListSerializer(many=True),
            401: OpenApiResponse(description="Authentication failed"),
        },
        description="""
        List all your blog posts.
        
        Returns a collection of blog posts that you have generated, including:
        - Blog titles
        - Original YouTube video titles
        - Author information
        - Creation and update timestamps
        """,
        summary="Your Blog Collection",
    )
    def get_queryset(self):
        return BlogPost.objects.filter(user=self.request.user)


class BlogDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogResponseSerializer

    @extend_schema(
        tags=["Blog Posts"],
        responses={
            204: OpenApiResponse(description="Blog post deleted successfully"),
            401: OpenApiResponse(description="Authentication failed"),
            404: OpenApiResponse(description="Blog post not found"),
        },
        description="""
        Remove a blog post from your collection.
        
        This action is permanent and cannot be undone. Only the owner of the 
        blog post can delete it.
        """,
        summary="Remove Blog Post",
    )
    def get_queryset(self):
        return BlogPost.objects.filter(user=self.request.user)


class BlogDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogResponseSerializer
    lookup_field = 'pk'

    @extend_schema(
        tags=["Blog Posts"],
        responses={
            200: BlogResponseSerializer,
            401: OpenApiResponse(description="Authentication failed"),
            403: OpenApiResponse(description="Not authorized"),
            404: OpenApiResponse(description="Blog post not found"),
        },
        description="""
        Retrieve a specific blog post.
        
        Returns the full content of a blog post if you are the author.
        Includes the blog content, metadata, and author information.
        """,
        summary="View Blog Post",
    )
    def get_queryset(self):
        """Only allow users to view their own blogs"""
        return BlogPost.objects.filter(user=self.request.user)
