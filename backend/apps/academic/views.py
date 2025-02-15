from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Academic
from .serializers import AcademicSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend




class AcademicViewSet(viewsets.ModelViewSet):
    queryset = Academic.objects.all()
    serializer_class = AcademicSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['title']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
