# apps/forum/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumPost, Comment
from .serializers import ForumPostSerializer, CommentSerializer
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
