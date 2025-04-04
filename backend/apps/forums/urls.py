from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.forums import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tags/', views.TagListView.as_view(), name='tag-list'),
    path('posts/<int:post_pk>/comments/', views.CommentViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='post-comments'),
    path('posts/<int:post_pk>/comments/<int:pk>/', views.CommentViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='comment-detail'),
    
    # Remove the 'api/' prefix from these paths since they're already under api/forum/
    path('posts/', views.get_posts, name='get-posts'),
    path('posts/<int:pk>/', views.get_post_detail, name='get-post-detail'),
    path('posts/create/', views.create_post, name='create-post'),
    path('posts/<int:post_id>/comments/create/', views.create_comment, name='create-comment'),
    
    # Add like endpoint
    path('posts/<int:post_id>/like/', views.like_post, name='like-post'),
]
