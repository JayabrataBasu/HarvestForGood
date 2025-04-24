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
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='forum_posts',
        null=True,  # Allow null for guest posts
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.IntegerField(default=0)
    
    # Guest user fields
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    guest_affiliation = models.CharField(max_length=100, null=True, blank=True)
    guest_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        if self.author:
            return f"{self.title} by {self.author.username}"
        elif self.guest_name:
            return f"{self.title} by {self.guest_name} (Guest)"
        else:
            return self.title

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
        related_name='forum_comments',
        null=True,  # Allow null for guest comments
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Guest user fields
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    guest_affiliation = models.CharField(max_length=100, null=True, blank=True)
    guest_email = models.EmailField(null=True, blank=True)
    
    def __str__(self):
        author_name = self.author.username if self.author else (self.guest_name or "Anonymous")
        return f"Comment by {author_name} on {self.post.title}"

    class Meta:
        db_table = 'forum_comment'
        ordering = ['-created_at']
