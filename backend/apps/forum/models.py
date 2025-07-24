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

class ForumTag(models.Model):
    """Dedicated tag model for forum posts (separate from research paper keywords)"""
    name = models.CharField(max_length=50, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    usage_count = models.IntegerField(default=0, db_index=True)
    
    class Meta:
        db_table = 'forum_tag'
        ordering = ['-usage_count', 'name']
    
    def __str__(self):
        return f"#{self.name}"
    
    def increment_usage(self):
        """Increment usage count"""
        self.usage_count += 1
        self.save(update_fields=['usage_count'])
    
    def decrement_usage(self):
        """Decrement usage count (when tag is removed from a post)"""
        if self.usage_count > 0:
            self.usage_count -= 1
            self.save(update_fields=['usage_count'])

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
        related_name='forum_app_posts',  # Changed from forum_posts 
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.IntegerField(default=0)
    
    # Guest user fields
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    guest_affiliation = models.CharField(max_length=100, null=True, blank=True)
    guest_email = models.EmailField(null=True, blank=True)

    # Add tags field
    tags = models.ManyToManyField(
        ForumTag,
        related_name='posts',
        blank=True,
        through='ForumPostTag'
    )
    
    def get_likes_count(self):
        """Get the actual count of likes for this post"""
        return self.post_likes.count()

    def is_liked_by_user(self, user):
        """Check if this post is liked by a specific user"""
        if not user or not user.is_authenticated:
            return False
        return self.post_likes.filter(user=user).exists()

    def is_liked_by_guest(self, guest_identifier):
        """Check if this post is liked by a specific guest identifier"""
        if not guest_identifier:
            return False
        return self.post_likes.filter(guest_identifier=guest_identifier).exists()

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
        related_name='forum_app_comments',  # Changed from forum_comments
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Guest user fields
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    guest_affiliation = models.CharField(max_length=100, null=True, blank=True)
    guest_email = models.EmailField(null=True, blank=True)
    
    def get_likes_count(self):
        """Get the actual count of likes for this comment"""
        return self.comment_likes.count()

    def is_liked_by_user(self, user):
        """Check if this comment is liked by a specific user"""
        if not user or not user.is_authenticated:
            return False
        return self.comment_likes.filter(user=user).exists()

    def is_liked_by_guest(self, guest_identifier):
        """Check if this comment is liked by a specific guest identifier"""
        if not guest_identifier:
            return False
        return self.comment_likes.filter(guest_identifier=guest_identifier).exists()
    
    def __str__(self):
        author_name = self.author.username if self.author else (self.guest_name or "Anonymous")
        return f"Comment by {author_name} on {self.post.title}"

    class Meta:
        db_table = 'forum_comment'
        ordering = ['-created_at']

class Like(models.Model):
    """Model to track likes on posts and comments"""
    # Content type for polymorphic likes
    post = models.ForeignKey(
        ForumPost, 
        on_delete=models.CASCADE,
        related_name='post_likes',
        null=True,
        blank=True
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='comment_likes',
        null=True,
        blank=True
    )
    
    # User who liked (for authenticated users)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    # Guest information (for guest users)
    guest_identifier = models.CharField(max_length=255, null=True, blank=True)  # IP or session key
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'forum_like'
        # Ensure a user/guest can only like a post/comment once
        constraints = [
            models.UniqueConstraint(
                fields=['post', 'user'],
                condition=models.Q(user__isnull=False, post__isnull=False),
                name='unique_user_post_like'
            ),
            models.UniqueConstraint(
                fields=['comment', 'user'],
                condition=models.Q(user__isnull=False, comment__isnull=False),
                name='unique_user_comment_like'
            ),
            models.UniqueConstraint(
                fields=['post', 'guest_identifier'],
                condition=models.Q(guest_identifier__isnull=False, post__isnull=False),
                name='unique_guest_post_like'
            ),
            models.UniqueConstraint(
                fields=['comment', 'guest_identifier'],
                condition=models.Q(guest_identifier__isnull=False, comment__isnull=False),
                name='unique_guest_comment_like'
            ),
        ]
    
    def clean(self):
        # Ensure exactly one content object is set
        if not ((self.post and not self.comment) or (self.comment and not self.post)):
            raise ValidationError("Like must be associated with either a post or comment, but not both.")
        
        # Ensure either user or guest_identifier is set
        if not (self.user or self.guest_identifier):
            raise ValidationError("Like must have either a user or guest identifier.")
    
    def __str__(self):
        content = self.post or self.comment
        liker = self.user.username if self.user else (self.guest_name or "Guest")
        return f"Like by {liker} on {content}"

class ForumPostTag(models.Model):
    """Through model for post-tag relationship with timestamp"""
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
    tag = models.ForeignKey(ForumTag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'forum_post_tag'
        unique_together = ('post', 'tag')
