# apps/forum/serializers.py
from rest_framework import serializers
from .models import ForumPost, Comment
from .validators import validate_post_content, validate_title
import logging

logger = logging.getLogger(__name__)

class CommentSerializer(serializers.ModelSerializer):
    # Provide a safe author field for backward compatibility
    author = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()
    
    def get_author(self, obj):
        """Provide safe author object for backward compatibility"""
        try:
            if obj.author:
                return {
                    'id': obj.author.id,
                    'username': getattr(obj.author, 'username', ''),
                    'first_name': getattr(obj.author, 'first_name', '') or '',
                    'last_name': getattr(obj.author, 'last_name', '') or '',
                    'email': getattr(obj.author, 'email', '') or '',
                }
            else:
                return {
                    'id': None,
                    'username': '',
                    'first_name': '',
                    'last_name': '',
                    'email': '',
                }
        except Exception as e:
            logger.error(f"Error getting author for comment {obj.id}: {str(e)}")
            return {
                'id': None,
                'username': '',
                'first_name': '',
                'last_name': '',
                'email': '',
            }
    
    def get_author_name(self, obj):
        """Get the author name, handling both registered users and guests"""
        try:
            if obj.author:
                first_name = getattr(obj.author, 'first_name', '') or ''
                last_name = getattr(obj.author, 'last_name', '') or ''
                full_name = f"{first_name} {last_name}".strip()
                return full_name if full_name else getattr(obj.author, 'username', 'Anonymous')
            elif hasattr(obj, 'guest_name') and obj.guest_name:
                return obj.guest_name
            return "Anonymous"
        except Exception as e:
            logger.error(f"Error getting author name for comment {obj.id}: {str(e)}")
            return "Anonymous"
    
    def get_author_details(self, obj):
        """Provide safe author details for frontend"""
        try:
            if obj.author:
                return {
                    'id': obj.author.id,
                    'username': getattr(obj.author, 'username', ''),
                    'first_name': getattr(obj.author, 'first_name', '') or '',
                    'last_name': getattr(obj.author, 'last_name', '') or '',
                    'email': getattr(obj.author, 'email', ''),
                    'is_guest': False
                }
            else:
                return {
                    'id': None,
                    'username': '',
                    'first_name': '',
                    'last_name': '',
                    'email': '',
                    'is_guest': True,
                    'guest_name': getattr(obj, 'guest_name', ''),
                    'guest_affiliation': getattr(obj, 'guest_affiliation', '')
                }
        except Exception as e:
            logger.error(f"Error getting author details for comment {obj.id}: {str(e)}")
            return {
                'id': None,
                'username': '',
                'first_name': '',
                'last_name': '',
                'email': '',
                'is_guest': True,
                'guest_name': '',
                'guest_affiliation': ''
            }
    
    def validate_post(self, value):
        if not ForumPost.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid post ID")
        return value
    
    class Meta:
        model = Comment
        fields = ('id', 'post', 'content', 'author', 'author_name', 'author_details',
                 'created_at', 'updated_at', 'guest_name', 'guest_affiliation')
        extra_kwargs = {
            'content': {'required': True, 'allow_blank': False}
        }

class ForumPostSerializer(serializers.ModelSerializer):  # Fixed: was ModelViewSet
    comments = CommentSerializer(many=True, read_only=True)
    # Provide a safe author field for backward compatibility
    author = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()
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
    
    def get_author(self, obj):
        """Provide safe author object for backward compatibility"""
        try:
            if obj.author:
                return {
                    'id': obj.author.id,
                    'username': getattr(obj.author, 'username', ''),
                    'first_name': getattr(obj.author, 'first_name', '') or '',
                    'last_name': getattr(obj.author, 'last_name', '') or '',
                    'email': getattr(obj.author, 'email', '') or '',
                }
            else:
                return {
                    'id': None,
                    'username': '',
                    'first_name': '',
                    'last_name': '',
                    'email': '',
                }
        except Exception as e:
            logger.error(f"Error getting author for post {obj.id}: {str(e)}")
            return {
                'id': None,
                'username': '',
                'first_name': '',
                'last_name': '',
                'email': '',
            }
    
    def get_author_name(self, obj):
        """Get the author name, handling both registered users and guests"""
        try:
            if obj.author:
                first_name = getattr(obj.author, 'first_name', '') or ''
                last_name = getattr(obj.author, 'last_name', '') or ''
                full_name = f"{first_name} {last_name}".strip()
                return full_name if full_name else getattr(obj.author, 'username', 'Anonymous')
            elif hasattr(obj, 'guest_name') and obj.guest_name:
                return obj.guest_name
            return "Anonymous"
        except Exception as e:
            logger.error(f"Error getting author name for post {obj.id}: {str(e)}")
            return "Anonymous"
    
    def get_author_details(self, obj):
        """Provide safe author details for frontend"""
        try:
            if obj.author:
                return {
                    'id': obj.author.id,
                    'username': getattr(obj.author, 'username', ''),
                    'first_name': getattr(obj.author, 'first_name', '') or '',
                    'last_name': getattr(obj.author, 'last_name', '') or '',
                    'email': getattr(obj.author, 'email', ''),
                    'is_guest': False
                }
            else:
                return {
                    'id': None,
                    'username': '',
                    'first_name': '',
                    'last_name': '',
                    'email': '',
                    'is_guest': True,
                    'guest_name': getattr(obj, 'guest_name', ''),
                    'guest_affiliation': getattr(obj, 'guest_affiliation', '')
                }
        except Exception as e:
            logger.error(f"Error getting author details for post {obj.id}: {str(e)}")
            return {
                'id': None,
                'username': '',
                'first_name': '',
                'last_name': '',
                'email': '',
                'is_guest': True,
                'guest_name': '',
                'guest_affiliation': ''
            }
    
    class Meta:
        model = ForumPost
        fields = ('id', 'title', 'content', 'author', 'author_name', 'author_details',
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
