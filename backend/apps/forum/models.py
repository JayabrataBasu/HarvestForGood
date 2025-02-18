from django.db import models
from apps.users.models import User
from django.conf import settings
from django.db import models
from .validators import validate_post_content, validate_title

class ForumPost(models.Model):
    title = models.CharField(
        max_length=200, 
        validators=[validate_title]
    )
    content = models.TextField(
        validators=[validate_post_content]
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='forum_posts'  # Add this
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    class Meta:
        db_table = 'forum_post'

class Comment(models.Model):
    content = models.TextField(
        validators=[validate_post_content]
    )
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE,related_name='comments')
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Comment by {self.author.username} on {self.created_at.strftime("%Y-%m-%d")}'

    class Meta:
        db_table = 'forum_comment'

