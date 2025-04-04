# apps/forum/serializers.py
from rest_framework import serializers
from .models import ForumPost, Comment
from .validators import validate_post_content, validate_title

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    def validate_post(self, value):
        if not ForumPost.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid post ID")
        return value
    
    class Meta:
        model = Comment
        fields = ('id', 'post', 'content', 'author', 'author_name', 'created_at', 'updated_at')
        extra_kwargs = {
            'content': {'required': True, 'allow_blank': False}
        }

class ForumPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    def validate(self, data):
        # Additional custom validation
        if 'title' in data and 'content' in data:
            if data['title'].lower() in data['content'].lower():
                raise serializers.ValidationError(
                    "Title should not be repeated in content"
                )
        return data
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    class Meta:
        model = ForumPost
        fields = ('id', 'title', 'content', 'author', 'author_name', 
                 'created_at', 'updated_at', 'comments', 'comments_count', 'likes_count')
        extra_kwargs = {
            'title': {'validators': [validate_title]},
            'content': {'validators': [validate_post_content]},
        }
