from rest_framework import serializers
from .models import ResearchPaper, Author, Keyword, KeywordCategory

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'affiliation', 'email']

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['id', 'name']

class KeywordCategorySerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True, read_only=True)
    
    class Meta:
        model = KeywordCategory
        fields = ['id', 'name', 'description', 'keywords']

class ResearchPaperSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=False)
    keywords = KeywordSerializer(many=True, read_only=False)
    # Fix the publication_date field to handle date objects properly
    publication_date = serializers.SerializerMethodField()
    
    class Meta:
        model = ResearchPaper
        fields = [
            'id', 'title', 'abstract', 'authors', 'publication_year',
            'publication_date', 'journal', 'keywords', 'download_url', 'doi', 'volume',
            'issue', 'pages', 'created_at', 'updated_at', 'slug', 'methodology_type',
            'citation_count', 'citation_trend'
        ]
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }
    
    def get_publication_date(self, obj):
        """
        Convert publication_year to an integer, handling date objects.
        This solves the TypeError when converting datetime.date to int.
        """
        if obj.publication_year is None:
            return None
            
        # If it's already an integer, return it
        if isinstance(obj.publication_year, int):
            return obj.publication_year
            
        # If it's a date object, extract the year
        if hasattr(obj.publication_year, 'year'):
            return obj.publication_year.year
            
        # Try to convert to int as a last resort
        try:
            return int(obj.publication_year)
        except (ValueError, TypeError):
            return None
    
    def create(self, validated_data):
        # Extract nested data
        authors_data = validated_data.pop('authors', [])
        keywords_data = validated_data.pop('keywords', [])
        
        # Create the paper
        paper = ResearchPaper.objects.create(**validated_data)
        
        # Handle authors
        for author_data in authors_data:
            author, _ = Author.objects.get_or_create(
                name=author_data['name'],
                defaults={'affiliation': author_data.get('affiliation', ''),
                          'email': author_data.get('email', None)}
            )
            paper.authors.add(author)
        
        # Handle keywords
        for keyword_data in keywords_data:
            keyword, _ = Keyword.objects.get_or_create(
                name=keyword_data['name'].lower().strip()
            )
            paper.keywords.add(keyword)
        
        return paper
    
    def update(self, instance, validated_data):
        # Extract nested data
        authors_data = validated_data.pop('authors', None)
        keywords_data = validated_data.pop('keywords', None)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update authors if provided
        if authors_data is not None:
            instance.authors.clear()
            for author_data in authors_data:
                author, _ = Author.objects.get_or_create(
                    name=author_data['name'],
                    defaults={'affiliation': author_data.get('affiliation', ''),
                              'email': author_data.get('email', None)}
                )
                instance.authors.add(author)
        
        # Update keywords if provided
        if keywords_data is not None:
            instance.keywords.clear()
            for keyword_data in keywords_data:
                keyword, _ = Keyword.objects.get_or_create(
                    name=keyword_data['name'].lower().strip()
                )
                instance.keywords.add(keyword)
        
        return instance
