# apps/forum/serializers.py
from rest_framework import serializers
from .models import ForumPost, Comment, Like, ForumTag
from .validators import validate_post_content, validate_title
import logging

logger = logging.getLogger(__name__)

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'user', 'guest_name', 'created_at')

class CommentSerializer(serializers.ModelSerializer):
    # Provide a safe author field for backward compatibility
    author = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
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
    
    def get_likes_count(self, obj):
        """Get total likes count for this comment"""
        return obj.get_likes_count()
    
    def get_is_liked(self, obj):
        """Check if current user/guest has liked this comment"""
        request = self.context.get('request')
        if not request:
            return False
            
        if request.user and request.user.is_authenticated:
            return obj.is_liked_by_user(request.user)
        else:
            # For guest users, use session key or IP as identifier
            guest_identifier = request.session.session_key or request.META.get('REMOTE_ADDR')
            return obj.is_liked_by_guest(guest_identifier)
    
    class Meta:
        model = Comment
        fields = ('id', 'post', 'content', 'author', 'author_name', 'author_details',
                 'created_at', 'updated_at', 'guest_name', 'guest_affiliation',
                 'likes_count', 'is_liked')
        extra_kwargs = {
            'content': {'required': True, 'allow_blank': False}
        }

class ForumTagSerializer(serializers.ModelSerializer):
    """Serializer for forum tags"""
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ForumTag
        fields = ('id', 'name', 'display_name', 'usage_count', 'created_at')
        read_only_fields = ('usage_count', 'created_at')
    
    def get_display_name(self, obj):
        return f"#{obj.name}"

class ForumPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    # Provide a safe author field for backward compatibility
    author = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    guest_name = serializers.CharField(read_only=True, required=False, allow_null=True)
    guest_affiliation = serializers.CharField(read_only=True, required=False, allow_null=True)
    
    # Add tag fields
    tags = ForumTagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
        allow_empty=True
    )
    
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
        try:
            # If obj is a dict (e.g., during serialization of validated_data)
            if isinstance(obj, dict):
                author = obj.get('author', None)
                return author.username if author else None
            # If obj is a model instance
            if obj.author:
                return obj.author.username
            return None
        except Exception as e:
            # Use getattr to avoid AttributeError on dicts
            obj_id = getattr(obj, 'id', None) or obj.get('id', None) if isinstance(obj, dict) else None
            logger.error(f"Error getting author for post {obj_id}: {str(e)}")
            return None
    
    def get_author_name(self, obj):
        """Get the author name, handling both registered users and guests"""
        try:
            # If obj is a dict (e.g., during serialization of validated_data)
            if isinstance(obj, dict):
                author = obj.get('author', None)
                return author.username if author else None
            # If obj is a model instance
            if obj.author:
                return obj.author.username
            return None
        except Exception as e:
            obj_id = obj.get('id', None) if isinstance(obj, dict) else getattr(obj, 'id', None)
            logger.error(f"Error getting author name for post {obj_id}: {str(e)}")
            return None
    
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
    
    def get_likes_count(self, obj):
        """Get total likes count for this post"""
        return obj.get_likes_count()
    
    def get_is_liked(self, obj):
        """Check if current user/guest has liked this post"""
        request = self.context.get('request')
        if not request:
            return False
            
        if request.user and request.user.is_authenticated:
            return obj.is_liked_by_user(request.user)
        else:
            # For guest users, use session key or IP as identifier
            guest_identifier = request.session.session_key or request.META.get('REMOTE_ADDR')
            return obj.is_liked_by_guest(guest_identifier)
    
    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        try:
            post = ForumPost.objects.create(**validated_data)
            tags = []
            for name in tag_names:
                tag, _ = ForumTag.objects.get_or_create(name=name)
                tags.append(tag)
            post.tags.set(tags)
            return post
        except Exception as e:
            logger.error(f"Error creating ForumPost: {str(e)}")
            raise serializers.ValidationError("Failed to create forum post.")
    
    def update(self, instance, validated_data):
        """Update post and handle tag changes"""
        tag_names = validated_data.pop('tag_names', None)
        
        # Update the post
        post = super().update(instance, validated_data)
        
        # Handle tag updates if provided
        if tag_names is not None:
            # Remove old tags
            instance.tags.clear()
            # Add new tags
            instance.tags.set(tag_names)
        
        return post

    class Meta:
        model = ForumPost
        fields = ('id', 'title', 'content', 'author', 'author_name', 'author_details',
                 'created_at', 'updated_at', 'comments', 'comments_count', 
                 'likes_count', 'is_liked', 'guest_name', 'guest_affiliation',
                 'tags', 'tag_names', 'pinned')
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
        fields = (
            'id', 'post_id', 'content', 'guest_name', 'guest_affiliation',
            'guest_email', 'created_at'
        )
        extra_kwargs = {
            'content': {'required': True, 'allow_blank': False}
        }

    def validate_post_id(self, value):
        if not ForumPost.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid post ID")
        return value
