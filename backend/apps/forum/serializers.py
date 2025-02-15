from rest_framework import serializers
from .models import ForumPost, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'post', 'content', 'author', 'created_at')

class ForumPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = ForumPost
        fields = ('id', 'title', 'content', 'author', 'created_at', 'updated_at', 'comments')
