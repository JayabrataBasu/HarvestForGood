from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcademicViewSet

router = DefaultRouter()
router.register(r'academics', AcademicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
