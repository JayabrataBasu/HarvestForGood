from rest_framework import serializers
from apps.forums.models import Post, Comment, Tag
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'author_name', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.username

class PostSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    author_name = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source='tags'
    )
    comment_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'author', 'author_name',
            'created_at', 'updated_at', 'tags', 'tag_ids', 'comment_count', 'likes_count'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.username

class PostDetailSerializer(PostSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments']
