# apps/forum/models.py
from django.db import models
from django.utils.safestring import mark_safe
from django.core.exceptions import ValidationError
from django.db.models import Q
from apps.users.models import User
from django.conf import settings
from .validators import validate_post_content, validate_title

class SafeQueryMixin:
    @classmethod
    def safe_search(cls, query):
        if not isinstance(query, str):
            raise ValidationError("Invalid query type")
            
        sanitized_query = mark_safe(query)
        return cls.objects.filter(
            Q(title__icontains=sanitized_query) |
            Q(content__icontains=sanitized_query)
        )

class ForumPost(SafeQueryMixin, models.Model):
    title = models.CharField(
        max_length=200, 
        validators=[validate_title]
    )
    content = models.TextField(
        validators=[validate_post_content]
    )
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='forum_posts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} by {self.author.username}"

    class Meta:
        db_table = 'forum_post'
        ordering = ['-created_at']

class Comment(SafeQueryMixin, models.Model):
    post = models.ForeignKey(
        ForumPost, 
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField(
        validators=[validate_post_content]
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='forum_comments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Comment by {self.author.username} on {self.created_at.strftime("%Y-%m-%d")}'

    class Meta:
        db_table = 'forum_comment'
        ordering = ['-created_at']
