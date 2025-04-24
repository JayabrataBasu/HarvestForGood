# apps/forum/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumPost, Comment
from .serializers import (
    ForumPostSerializer, CommentSerializer, 
    GuestPostSerializer, GuestCommentSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
import logging
from rest_framework.throttling import ScopedRateThrottle

logger = logging.getLogger(__name__)

class ForumPostViewSet(viewsets.ModelViewSet):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'forum_posts'
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    # Use IsAuthenticatedOrReadOnly to allow anonymous users to read posts
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'title']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
            logger.info(f"Forum post created by user {self.request.user.username}")
        except Exception as e:
            logger.error(f"Error creating forum post: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def like_post(self, request, pk=None):
        """
        Like a forum post
        """
        post = self.get_object()
        
        # Simple implementation: just increment likes_count field
        # For a real app, you'd likely want to track which users liked which posts
        if not hasattr(post, 'likes_count'):
            post.likes_count = 1
        else:
            post.likes_count += 1
        post.save()
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # Also update this to IsAuthenticatedOrReadOnly if you want to allow viewing comments without authentication
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'post']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
            logger.info(f"Comment created by user {self.request.user.username}")
        except Exception as e:
            logger.error(f"Error creating comment: {str(e)}")
            raise

@api_view(['POST'])
@permission_classes([AllowAny])
def create_guest_post(request):
    """Create a forum post as a guest"""
    serializer = GuestPostSerializer(data=request.data)
    if serializer.is_valid():
        # Extract guest info
        guest_name = serializer.validated_data.pop('guest_name')
        guest_affiliation = serializer.validated_data.pop('guest_affiliation')
        guest_email = serializer.validated_data.pop('guest_email', None)
        
        # Create the post with guest info in the content
        post = ForumPost.objects.create(
            **serializer.validated_data,
            author=None,  # No author for guest posts
            guest_name=guest_name,
            guest_affiliation=guest_affiliation,
            guest_email=guest_email if guest_email else None
        )
        
        # Return the created post data
        return Response(
            ForumPostSerializer(post).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_guest_comment(request):
    """Create a comment as a guest"""
    serializer = GuestCommentSerializer(data=request.data)
    if serializer.is_valid():
        # Extract post_id and guest info
        post_id = serializer.validated_data.pop('post_id')
        guest_name = serializer.validated_data.pop('guest_name')
        guest_affiliation = serializer.validated_data.pop('guest_affiliation')
        guest_email = serializer.validated_data.pop('guest_email', None)
        
        try:
            post = ForumPost.objects.get(id=post_id)
            
            # Create the comment with guest info
            comment = Comment.objects.create(
                post=post,
                author=None,  # No author for guest comments
                **serializer.validated_data,
                guest_name=guest_name,
                guest_affiliation=guest_affiliation,
                guest_email=guest_email if guest_email else None
            )
            
            return Response(
                CommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        except ForumPost.DoesNotExist:
            return Response(
                {"error": "Post not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
