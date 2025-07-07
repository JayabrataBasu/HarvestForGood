# apps/forum/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumPost, Comment, Like
from .serializers import (
    ForumPostSerializer, CommentSerializer, 
    GuestPostSerializer, GuestCommentSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
import logging
from rest_framework.throttling import ScopedRateThrottle
from django.db import IntegrityError

logger = logging.getLogger(__name__)

class ForumPostViewSet(viewsets.ModelViewSet):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'forum_posts'
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    # Use AllowAny for read operations, require auth for write operations
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'title']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Allow anyone to view posts, but require authentication for creating/editing
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        try:
            # Only set author if user is authenticated
            if self.request.user and self.request.user.is_authenticated:
                serializer.save(author=self.request.user)
            else:
                serializer.save(author=None)
            logger.info(f"Forum post created")
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

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], url_path='like')
    def like(self, request, pk=None):
        """
        Like/unlike a forum post (works for both authenticated and guest users)
        """
        try:
            post = self.get_object()
            
            # Determine user or guest identifier
            if request.user and request.user.is_authenticated:
                user = request.user
                guest_identifier = None
                guest_name = None
            else:
                user = None
                # Create or get session key for guests
                if not request.session.session_key:
                    request.session.create()
                guest_identifier = request.session.session_key or request.META.get('REMOTE_ADDR')
                guest_name = request.data.get('guest_name', 'Anonymous Guest')
                
                if not guest_identifier:
                    return Response(
                        {'error': 'Unable to identify guest user'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Check if already liked
            if user:
                like_exists = Like.objects.filter(post=post, user=user).exists()
                if like_exists:
                    # Unlike - delete the like
                    Like.objects.filter(post=post, user=user).delete()
                    action_taken = 'unliked'
                else:
                    # Like - create new like
                    Like.objects.create(post=post, user=user)
                    action_taken = 'liked'
            else:
                like_exists = Like.objects.filter(post=post, guest_identifier=guest_identifier).exists()
                if like_exists:
                    # Unlike - delete the like
                    Like.objects.filter(post=post, guest_identifier=guest_identifier).delete()
                    action_taken = 'unliked'
                else:
                    # Like - create new like
                    Like.objects.create(
                        post=post, 
                        guest_identifier=guest_identifier,
                        guest_name=guest_name
                    )
                    action_taken = 'liked'
            
            # Return updated post data
            serializer = self.get_serializer(post)
            return Response({
                'action': action_taken,
                'likes_count': post.get_likes_count(),
                'is_liked': post.is_liked_by_user(user) if user else post.is_liked_by_guest(guest_identifier),
                'post': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error liking post {pk}: {str(e)}")
            return Response(
                {'error': f'Failed to like post: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # Use AllowAny for read operations, require auth for write operations
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'post']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Allow anyone to view comments, but require authentication for creating/editing
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        try:
            # Only set author if user is authenticated
            if self.request.user and self.request.user.is_authenticated:
                serializer.save(author=self.request.user)
            else:
                serializer.save(author=None)
            logger.info(f"Comment created")
        except Exception as e:
            logger.error(f"Error creating comment: {str(e)}")
            raise

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], url_path='like')
    def like(self, request, pk=None):
        """
        Like/unlike a comment (works for both authenticated and guest users)
        """
        try:
            comment = self.get_object()
            
            # Determine user or guest identifier
            if request.user and request.user.is_authenticated:
                user = request.user
                guest_identifier = None
                guest_name = None
            else:
                user = None
                # Create or get session key for guests
                if not request.session.session_key:
                    request.session.create()
                guest_identifier = request.session.session_key or request.META.get('REMOTE_ADDR')
                guest_name = request.data.get('guest_name', 'Anonymous Guest')
                
                if not guest_identifier:
                    return Response(
                        {'error': 'Unable to identify guest user'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Check if already liked
            if user:
                like_exists = Like.objects.filter(comment=comment, user=user).exists()
                if like_exists:
                    # Unlike - delete the like
                    Like.objects.filter(comment=comment, user=user).delete()
                    action_taken = 'unliked'
                else:
                    # Like - create new like
                    Like.objects.create(comment=comment, user=user)
                    action_taken = 'liked'
            else:
                like_exists = Like.objects.filter(comment=comment, guest_identifier=guest_identifier).exists()
                if like_exists:
                    # Unlike - delete the like
                    Like.objects.filter(comment=comment, guest_identifier=guest_identifier).delete()
                    action_taken = 'unliked'
                else:
                    # Like - create new like
                    Like.objects.create(
                        comment=comment, 
                        guest_identifier=guest_identifier,
                        guest_name=guest_name
                    )
                    action_taken = 'liked'
            
            # Return updated comment data
            serializer = self.get_serializer(comment)
            return Response({
                'action': action_taken,
                'likes_count': comment.get_likes_count(),
                'is_liked': comment.is_liked_by_user(user) if user else comment.is_liked_by_guest(guest_identifier),
                'comment': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error liking comment {pk}: {str(e)}")
            return Response(
                {'error': f'Failed to like comment: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
