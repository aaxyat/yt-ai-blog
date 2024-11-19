from rest_framework import serializers

from .models import BlogPost


class BlogRequestSerializer(serializers.Serializer):
    url = serializers.URLField(
        required=True,
        help_text=(
            "YouTube video URL to generate blog post from. Supports standard, "
            "shortened, and embed URLs."
        ),
    )
    regen = serializers.CharField(
        required=False,
        default="false",
        allow_null=True,
        help_text=(
            "Set to 'true' to force regeneration of an existing blog post. "
            "Case-insensitive. Defaults to 'false' if not provided."
        ),
    )

    def validate_regen(self, value):
        """Convert string value to boolean, case-insensitive"""
        if value is None:
            return False
            
        if isinstance(value, bool):
            return value
            
        if isinstance(value, str):
            return value.lower() in ['true', 't', 'yes', 'y', '1']
            
        return bool(value)


class BlogResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "id",
            "youtube_url",
            "youtube_title",
            "blog_title",
            "content",
            "author_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class BlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "id",
            "youtube_title",
            "blog_title",
            "author_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
