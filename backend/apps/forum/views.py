from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumPost, Comment
from .serializers import ForumPostSerializer, CommentSerializer
from rest_framework.permissions import IsAuthenticated


class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'title']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']

#admin.site.register(ForumPost, ForumPostAdmin)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['author', 'post']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
