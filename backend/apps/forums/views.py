from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.contrib.auth import get_user_model
from django.db.models import Count

# Import your models - make sure these exist or create them
from apps.forums.models import Post, Comment, Tag
from apps.forums.serializers import (
    PostSerializer, 
    PostDetailSerializer,
    CommentSerializer,
    TagSerializer
)
from apps.forums.permissions import IsAuthorOrReadOnly

User = get_user_model()

class PostViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing forum posts.
    """
    queryset = Post.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for a specific post"""
        post = self.get_object()
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular posts based on comment count"""
        posts = Post.objects.annotate(comment_count=Count('comments')).order_by('-comment_count')[:10]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing comments.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post)

class TagListView(generics.ListAPIView):
    """
    View to list all available tags
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

# If you prefer function-based views, here's the simpler implementation
@api_view(['GET'])
@permission_classes([AllowAny])
def get_posts(request):
    """
    List all forum posts
    """
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_post_detail(request, pk):
    """
    Retrieve a specific post with its details
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PostDetailSerializer(post)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    """
    Create a new forum post
    """
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    """
    Add a comment to a specific post
    """
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    """
    Like a specific post
    """
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Simple implementation: just increment likes_count field
    # For a real app, you'd likely want to track which users liked which posts
    if not hasattr(post, 'likes_count'):
        post.likes_count = 1
    else:
        post.likes_count += 1
    post.save()
    
    serializer = PostDetailSerializer(post)
    return Response(serializer.data)
