from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class BlogPost(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    youtube_url = models.URLField()
    youtube_title = models.CharField(max_length=255)
    blog_title = models.CharField(max_length=255)
    content = models.TextField()
    author_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['youtube_url']),
            models.Index(fields=['blog_title']),
            models.Index(fields=['user']),
            models.Index(fields=['author_name']),
        ]

    def __str__(self):
        return self.blog_title

    def save(self, *args, **kwargs):
        if not self.author_name:
            user = self.user
            self.author_name = (
                f"{user.first_name} {user.last_name}".strip() or
                user.email
            )
        super().save(*args, **kwargs)
