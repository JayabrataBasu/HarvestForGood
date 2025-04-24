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
    guest_name = serializers.CharField(read_only=True, required=False, allow_null=True)
    guest_affiliation = serializers.CharField(read_only=True, required=False, allow_null=True)
    
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
                 'created_at', 'updated_at', 'comments', 'comments_count', 
                 'likes_count', 'guest_name', 'guest_affiliation')
        extra_kwargs = {
            'title': {'validators': [validate_title]},
            'content': {'validators': [validate_post_content]},
        }

# New serializers for guest users
class GuestPostSerializer(serializers.ModelSerializer):
    guest_name = serializers.CharField(max_length=100, required=True)
    guest_affiliation = serializers.CharField(max_length=100, required=True)
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    
    class Meta:
        model = ForumPost
        fields = ('id', 'title', 'content', 'guest_name', 'guest_affiliation', 
                 'guest_email', 'created_at', 'updated_at')
        extra_kwargs = {
            'title': {'validators': [validate_title]},
            'content': {'validators': [validate_post_content]},
        }

class GuestCommentSerializer(serializers.ModelSerializer):
    guest_name = serializers.CharField(max_length=100, required=True)
    guest_affiliation = serializers.CharField(max_length=100, required=True)
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    post_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'post_id', 'content', 'guest_name', 'guest_affiliation', 
                 'guest_email', 'created_at')
        extra_kwargs = {
            'content': {'required': True, 'allow_blank': False}
        }
    
    def validate_post_id(self, value):
        if not ForumPost.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid post ID")
        return value
