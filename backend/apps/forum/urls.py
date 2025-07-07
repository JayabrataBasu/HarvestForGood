from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, CommentViewSet, create_guest_post, create_guest_comment

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('guest/posts/', create_guest_post, name='guest-post'),
    path('guest/comments/', create_guest_comment, name='guest-comment'),
    # Like endpoints are automatically included via the router:
    # /api/forum/posts/{id}/like_post/
    # /api/forum/comments/{id}/like_comment/
]
