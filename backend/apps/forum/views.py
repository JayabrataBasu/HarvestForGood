# apps/forum/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils.dateparse import parse_date
from .models import ForumPost, Comment, Like, ForumTag
from .serializers import (
    ForumPostSerializer, CommentSerializer, 
    GuestPostSerializer, GuestCommentSerializer,
    ForumTagSerializer
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
            raise serializers.ValidationError(f"Failed to create forum post: {str(e)}")

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

    def get_queryset(self):
        """Enhanced queryset with search, tag filtering, and date filtering"""
        queryset = ForumPost.objects.all().prefetch_related('tags', 'comments')
        
        # Search functionality
        search = self.request.query_params.get('search', '').strip()
        if search:
            # Case sensitive search
            queryset = queryset.filter(
                Q(title__contains=search) | 
                Q(content__contains=search)
            )
        
        # Tag filtering (exact match, all tags must be present)
        tag_search = self.request.query_params.get('tags', '').strip()
        if tag_search:
            # Parse hashtags from search
            tag_names = []
            for tag in tag_search.split():
                clean_tag = tag.strip().lower().lstrip('#')
                if clean_tag:
                    tag_names.append(clean_tag)
            
            if tag_names:
                # Posts must have ALL specified tags
                for tag_name in tag_names:
                    queryset = queryset.filter(tags__name=tag_name)
        
        # Date filtering
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            try:
                from_date = parse_date(date_from)
                if from_date:
                    queryset = queryset.filter(created_at__gte=from_date)
            except ValueError:
                pass
        
        if date_to:
            try:
                to_date = parse_date(date_to)
                if to_date:
                    queryset = queryset.filter(created_at__lte=to_date)
            except ValueError:
                pass
        
        return queryset.distinct().order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Override list to add pagination"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 10))
        page_size = min(max(page_size, 1), 50)  # Limit between 1 and 50
        
        paginator = Paginator(queryset, page_size)
        page_number = request.query_params.get('page', 1)
        
        try:
            page_obj = paginator.get_page(page_number)
        except Exception:
            page_obj = paginator.get_page(1)
        
        serializer = self.get_serializer(page_obj, many=True)
        
        return Response({
            'results': serializer.data,
            'pagination': {
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
                'has_next': page_obj.has_next(),
                'has_previous': page_obj.has_previous(),
                'page_size': page_size
            }
        })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)  # Add this line for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Call perform_create and then return the response
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
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

class ForumTagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for forum tags - read-only for listing and searching"""
    queryset = ForumTag.objects.all()
    serializer_class = ForumTagSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter tags by search term"""
        queryset = ForumTag.objects.all()
        
        search = self.request.query_params.get('search', '').strip()
        if search:
            clean_search = search.lower().lstrip('#')
            queryset = queryset.filter(name__icontains=clean_search)
        
        # Only return tags with usage > 0
        min_usage = int(self.request.query_params.get('min_usage', 0))
        queryset = queryset.filter(usage_count__gte=min_usage)
        
        return queryset.order_by('-usage_count', 'name')

@api_view(['POST'])
@permission_classes([AllowAny])
def create_guest_post(request):
    """Create a forum post as a guest with tags"""
    serializer = GuestPostSerializer(data=request.data)
    if serializer.is_valid():
        tag_names = request.data.get('tag_names', [])
        guest_name = serializer.validated_data.get('guest_name')
        guest_affiliation = serializer.validated_data.get('guest_affiliation')
        guest_email = serializer.validated_data.get('guest_email', None)
        # Remove guest fields from validated_data before creating post
        post_data = serializer.validated_data.copy()
        post_data.pop('guest_name', None)
        post_data.pop('guest_affiliation', None)
        post_data.pop('guest_email', None)
        post = ForumPost.objects.create(
            **post_data,
            author=None,
            guest_name=guest_name,
            guest_affiliation=guest_affiliation,
            guest_email=guest_email
        )
        # Add tags if provided
        if tag_names:
            tag_instances = []
            for tag_name in tag_names:
                tag_obj, _ = ForumTag.objects.get_or_create(name=tag_name.lower().lstrip('#'))
                tag_instances.append(tag_obj)
            post.tags.set(tag_instances)
        # Return the created post data
        return Response(
            ForumPostSerializer(post).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_popular_tags(request):
    """Get most popular forum tags"""
    limit = int(request.query_params.get('limit', 20))
    tags = ForumTag.objects.filter(usage_count__gt=0)[:limit]
    serializer = ForumTagSerializer(tags, many=True)
    return Response(serializer.data)
