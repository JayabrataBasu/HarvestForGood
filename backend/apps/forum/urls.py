from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet)
router.register(r'comments', CommentViewSet)

# Add like endpoint
urlpatterns = router.urls + [
    path('posts/<int:post_id>/like/', ForumPostViewSet.as_view({'post': 'like_post'}), name='post-like'),
]
