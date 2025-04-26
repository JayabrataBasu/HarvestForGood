from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResearchPaperViewSet, AuthorViewSet, KeywordViewSet, KeywordCategoryViewSet

router = DefaultRouter()
router.register(r'papers', ResearchPaperViewSet)
router.register(r'keywords', KeywordViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'keyword-categories', KeywordCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Special endpoint for bulk imports
    path('papers/bulk-import/', ResearchPaperViewSet.as_view({'post': 'bulk_import'}), name='paper-bulk-import'),
    
    # Additional custom endpoints (these are also registered automatically by the router above)
    # path('papers/<slug:slug>/related/', ResearchPaperViewSet.as_view({'get': 'related'}), name='paper-related'),
    # path('papers/popular-keywords/', ResearchPaperViewSet.as_view({'get': 'popular_keywords'}), name='popular-keywords'),
    # path('papers/trending/', ResearchPaperViewSet.as_view({'get': 'trending'}), name='trending-papers'),
]
