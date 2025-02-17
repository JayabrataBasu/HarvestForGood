from django.db import models
from apps.users.models import User

class ForumPost(models.Model):
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
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'forum_comment'
