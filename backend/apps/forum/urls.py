from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, CommentViewSet, ForumTagViewSet, create_guest_post, get_popular_tags

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'tags', ForumTagViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('guest/posts/', create_guest_post, name='guest-post'),
    path('tags/popular/', get_popular_tags, name='popular-tags'),
    # Like endpoints are automatically included via the router:
    # /api/forum/posts/{id}/like_post/
    # /api/forum/comments/{id}/like_comment/
]

