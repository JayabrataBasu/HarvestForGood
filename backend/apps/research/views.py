from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from django.db import transaction
from django.db.models import Count, Q
from django.core.exceptions import FieldError
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import ResearchPaper, Author, Keyword, KeywordCategory
from .serializers import (
    ResearchPaperSerializer, 
    AuthorSerializer, 
    KeywordSerializer,
    KeywordCategorySerializer
)
import django_filters
from apps.utils.fields import YearField
from rest_framework.throttling import ScopedRateThrottle

# Custom filter for YearField
class YearFieldFilter(django_filters.NumberFilter):
    pass

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [AllowAny]  # Allow anyone to view authors
    
    def get_queryset(self):
        queryset = Author.objects.all()
        name = self.request.query_params.get('name', None)
        
        if name:
            queryset = queryset.filter(name__icontains=name)
            
        return queryset

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = [AllowAny]  # Allow anyone to view keywords
    
    def get_queryset(self):
        queryset = Keyword.objects.all()
        name = self.request.query_params.get('name', None)
        
        if name:
            queryset = queryset.filter(name__icontains=name)
            
        return queryset

class KeywordCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows keyword categories to be viewed.
    """
    queryset = KeywordCategory.objects.all().order_by('name')
    serializer_class = KeywordCategorySerializer
    permission_classes = [AllowAny]  # Allow anyone to view categories
    filterset_fields = ['name']
    search_fields = ['name', 'description']

# Custom FilterSet for ResearchPaper that handles YearField
class ResearchPaperFilterSet(FilterSet):
    # Define year filters explicitly
    year = django_filters.NumberFilter(field_name='publication_year')
    year_gt = django_filters.NumberFilter(field_name='publication_year', lookup_expr='gt')
    year_lt = django_filters.NumberFilter(field_name='publication_year', lookup_expr='lt')
    year_gte = django_filters.NumberFilter(field_name='publication_year', lookup_expr='gte')
    year_lte = django_filters.NumberFilter(field_name='publication_year', lookup_expr='lte')
    
    class Meta:
        model = ResearchPaper
        fields = {
            'keywords__name': ['exact', 'in'],
            'authors__name': ['exact', 'in'],
            # publication_year is handled by our custom filters above
        }

def parse_year_param(year_str):
    """Helper function to safely parse year parameters"""
    if not year_str or year_str == 'undefined' or year_str == 'null':
        return None
    try:
        year = int(year_str)
        # Validate reasonable year range
        if 1900 <= year <= 2100:
            return year
        return None
    except (ValueError, TypeError):
        return None

@api_view(['GET'])
@permission_classes([AllowAny])
def filter_options(request):
    """
    Returns filter options with smart keyword categorization
    """
    # 1. Methodology types (cleaned)
    methodology_types = (
        ResearchPaper.objects
        .exclude(methodology_type__isnull=True)
        .exclude(methodology_type__exact="")
        .exclude(methodology_type__exact="Unknown")
        .values_list('methodology_type', flat=True)
        .distinct()
    )
    methodology_types = sorted(set(methodology_types))

    # 2. Publication years (1900-2025)
    years_available = (
        ResearchPaper.objects
        .exclude(publication_year__isnull=True)
        .exclude(publication_year__exact="")
        .values_list('publication_year', flat=True)
        .distinct()
    )
    valid_years = []
    for year in years_available:
        try:
            year_int = int(year)
            if 1900 <= year_int <= 2025:
                valid_years.append(year_int)
        except (ValueError, TypeError):
            continue
    valid_years.sort()

    # 3. Smart keyword categorization
    all_keywords = Keyword.objects.all().order_by('name')
    
    # Define region patterns for auto-detection
    region_patterns = [
        'AFRICA', 'ASIA', 'INDIA', 'EUROPE', 'AMERICA', 'AUSTRALIA', 
        'BRAZIL', 'CHINA', 'USA', 'UK', 'CANADA', 'MEXICO',
        'NORTH AMERICA', 'SOUTH AMERICA', 'LATIN AMERICA',
        'MIDDLE EAST', 'SOUTHEAST ASIA', 'EAST ASIA'
    ]
    
    region_keywords = []
    general_keywords = []
    
    for keyword in all_keywords:
        # Check if keyword matches region patterns
        is_region = any(
            region.lower() in keyword.name.lower() or 
            keyword.name.upper() in region_patterns
            for region in region_patterns
        )
        
        if is_region:
            region_keywords.append({
                "id": keyword.id, 
                "name": keyword.name
            })
        else:
            general_keywords.append({
                "id": keyword.id, 
                "name": keyword.name
            })

    # 4. Get keyword categories (existing structure)
    categories = KeywordCategory.objects.prefetch_related('keywords').all().order_by('name')
    keyword_categories = []
    for category in categories:
        keyword_list = [
            {"id": kw.id, "name": kw.name}
            for kw in category.keywords.all().order_by('name')
        ]
        keyword_categories.append({
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "keywords": keyword_list
        })

    return Response({
        "methodology_types": methodology_types,
        "year_range": {"min": 1900, "max": 2025},
        "years_available": valid_years,
        "keyword_categories": keyword_categories,
        "region_keywords": region_keywords,
        "general_keywords": general_keywords,
        "stats": {
            "total_papers": ResearchPaper.objects.count(),
            "total_regions": len(region_keywords),
            "total_general_keywords": len(general_keywords)
        }
    })
    
    
class ResearchPaperViewSet(viewsets.ModelViewSet):
    """
    API endpoint for research papers
    """
    # Update to use publication_year instead of publication_date
    queryset = ResearchPaper.objects.all().order_by('-publication_year')
    serializer_class = ResearchPaperSerializer
    permission_classes = [AllowAny]  # Allow anyone to view papers
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ResearchPaperFilterSet  # Use our custom filterset
    search_fields = ['title', 'abstract', 'authors__name', 'keywords__name']
    ordering_fields = ['publication_year', 'title', 'created_at', 'citation_count']  # Changed from publication_date
    ordering = ['-publication_year', '-created_at', 'id']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = ResearchPaper.objects.all().order_by('-publication_year', '-created_at', 'id')
        
        # Get query parameters
        q = self.request.query_params.get('q', None)
        keywords = self.request.query_params.getlist('keyword', [])
        authors = self.request.query_params.getlist('author', [])
        methodology_types = self.request.query_params.getlist('methodology_type', [])
        min_citations = self.request.query_params.get('min_citations', None)
        max_citations = self.request.query_params.get('max_citations', None)
        year_from = parse_year_param(self.request.query_params.get('year_from'))
        year_to = parse_year_param(self.request.query_params.get('year_to'))
        journal = self.request.query_params.get('journal', None)
        sort = self.request.query_params.get('sort', None)
        keyword_logic = self.request.query_params.get('keyword_logic', 'and').lower()
        
        # Full-text search
        if q:
            # Create search vectors for various fields
            search_vector = (
                SearchVector('title', weight='A') +
                SearchVector('abstract', weight='B') +
                SearchVector('authors__name', weight='C') +
                SearchVector('keywords__name', weight='C') +
                SearchVector('journal', weight='D')
            )
            search_query = SearchQuery(q)
            
            # Apply search vector, query and rank
            queryset = queryset.annotate(
                search=search_vector,
                rank=SearchRank(search_vector, search_query)
            ).filter(search=search_query)
            
            # If sort parameter is not provided or is 'relevance', order by search rank
            if not sort or sort == 'relevance':
                queryset = queryset.order_by('-rank')
        
        # Apply filters
        if keywords:
            if keyword_logic == 'and' and len(keywords) > 1:
                # Papers must have ALL selected keywords
                for kw in keywords:
                    queryset = queryset.filter(keywords__name=kw)
            else:
                # Default OR logic (any keyword matches)
                queryset = queryset.filter(keywords__name__in=keywords)

        if authors:
            queryset = queryset.filter(authors__name__in=authors)

        if methodology_types:
            queryset = queryset.filter(methodology_type__in=methodology_types)

        if min_citations is not None:
            queryset = queryset.filter(citation_count__gte=int(min_citations))

        if max_citations is not None:
            queryset = queryset.filter(citation_count__lte=int(max_citations))

        # Handle year filtering with better error handling
        if year_from is not None:
            queryset = queryset.filter(publication_year__gte=str(year_from))

        if year_to is not None:
            queryset = queryset.filter(publication_year__lte=str(year_to))

        if journal:
            queryset = queryset.filter(journal__icontains=journal)
        
        # Apply sorting if specified (and not already sorted by relevance)
        if sort and sort != 'relevance':
            if sort == 'date_newest':
                queryset = queryset.order_by('-publication_year')
            elif sort == 'date_oldest':
                queryset = queryset.order_by('publication_year')
            elif sort == 'citations_high':
                queryset = queryset.order_by('-citation_count')
            elif sort == 'citations_low':
                queryset = queryset.order_by('citation_count')
            elif sort == 'title_asc':
                queryset = queryset.order_by('title')
            elif sort == 'title_desc':
                queryset = queryset.order_by('-title')
        
        # Ensure distinct results
        return queryset.distinct()
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """
        Returns papers related to the current paper based on shared keywords
        """
        # Get the current paper
        paper = self.get_object()
        
        # Get the paper's keywords
        paper_keywords = paper.keywords.all()
        
        if not paper_keywords:
            return Response([])
        
        # Find papers with the same keywords, excluding the current paper
        related_papers = ResearchPaper.objects.filter(
            keywords__in=paper_keywords
        ).exclude(
            id=paper.id
        ).annotate(
            # Count the number of matching keywords
            matching_keywords=Count('keywords', filter=Q(keywords__in=paper_keywords))
        ).filter(
            # Ensure at least one keyword matches
            matching_keywords__gt=0
        ).order_by(
            # Order by number of matching keywords (descending) and publication date (descending)
            '-matching_keywords', '-publication_year'
        ).distinct()[:5]  # Limit to 5 related papers
        
        serializer = self.get_serializer(related_papers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular_keywords(self, request):
        """
        Returns the most popular keywords based on frequency of use in papers
        """
        limit = int(request.query_params.get('limit', 20))
        
        popular_keywords = Keyword.objects.annotate(
            paper_count=Count('papers')
        ).order_by('-paper_count')[:limit]
        
        serializer = KeywordSerializer(popular_keywords, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """
        Returns trending papers based on citation trend and recency
        """
        limit = int(request.query_params.get('limit', 10))
        
        # Get papers with increasing citation trends, sorted by citation count and date
        trending_papers = ResearchPaper.objects.filter(
            citation_trend='increasing'
        ).order_by(
            '-citation_count', '-publication_year'
        )[:limit]
        
        serializer = self.get_serializer(trending_papers, many=True)
        return Response(serializer.data)
    
    @transaction.atomic
    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        papers_data = request.data
        
        # Check if the input is a list
        if not isinstance(papers_data, list):
            return Response(
                {"error": "Expected a list of papers"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process each paper data
        for paper_data in papers_data:
            serializer = self.get_serializer(data=paper_data)
            try:
                # Validate and save the paper
                serializer.is_valid(raise_exception=True)
                serializer.save()
            except Exception as e:
                return Response({
                    'error': str(e),
                    'data': paper_data
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"status": "success"}, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
def paper_search(request):
    """Search papers by title, abstract, authors, or keywords"""
    query = request.GET.get('q', '')
    year_from = parse_year_param(request.GET.get('year_from'))
    year_to = parse_year_param(request.GET.get('year_to'))
    
    papers = ResearchPaper.objects.all()
    
    # Apply text search
    if query:
        papers = papers.filter(
            Q(title__icontains=query) |
            Q(abstract__icontains=query) |
            Q(authors__name__icontains=query) |
            Q(keywords__name__icontains=query)
        ).distinct()
    
    # Apply year filtering
    if year_from is not None:
        papers = papers.filter(publication_year__gte=str(year_from))
    if year_to is not None:
        papers = papers.filter(publication_year__lte=str(year_to))
    
    serializer = ResearchPaperSerializer(papers, many=True)
    return Response({'papers': serializer.data})

@api_view(['GET'])
def category_keywords(request, category_id):
    """Get keywords for a specific category"""
    try:
        category = KeywordCategory.objects.get(id=category_id)
        keywords = category.keywords.all()
        serializer = KeywordSerializer(keywords, many=True)
        return Response({'keywords': serializer.data})
    except KeywordCategory.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def paper_filter_options(request):
    """Get available filter options for papers"""
    try:
        # Get unique years from papers
        papers_qs = ResearchPaper.objects.exclude(publication_year__isnull=True).exclude(publication_year='')
        years = papers_qs.values_list('publication_year', flat=True).distinct()
        year_list = []
        for year in years:
            try:
                year_int = int(year)
                if 1900 <= year_int <= 2100:
                    year_list.append(year_int)
            except (ValueError, TypeError):
                continue
        year_list.sort()
        
        # Get available methodology types
        methodology_types = papers_qs.exclude(methodology_type__isnull=True).exclude(methodology_type='').values_list('methodology_type', flat=True).distinct()
        
        # Get keyword categories with counts (optimized query)
        categories = KeywordCategory.objects.prefetch_related('keywords').order_by('name')
        category_data = []
        for category in categories:
            category_data.append({
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'keyword_count': category.keywords.count()
            })
        
        # Get total counts for frontend
        total_papers = papers_qs.count()
        total_authors = Author.objects.count()
        total_keywords = Keyword.objects.count()
        
        return Response({
            'years': year_list,
            'methodology_types': list(methodology_types),
            'keyword_categories': category_data,
            'stats': {
                'total_papers': total_papers,
                'total_authors': total_authors,
                'total_keywords': total_keywords,
                'year_range': {
                    'min': min(year_list) if year_list else None,
                    'max': max(year_list) if year_list else None
                }
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)