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
    # Fix the publication_date field to handle various formats correctly
    publication_date = serializers.SerializerMethodField()
    methodology_type = serializers.CharField(required=False, allow_blank=True)
    
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
        Convert publication data to appropriate format, handling multiple types
        """
        if obj.publication_year is None:
            return None
            
        # Simply return the publication_year value since it's now stored as a string
        return obj.publication_year
    
    def create(self, validated_data):
        # Extract nested data
        authors_data = validated_data.pop('authors', [])
        keywords_data = validated_data.pop('keywords', [])
        
        # Ensure publication_year is a string
        if 'publication_year' in validated_data and validated_data['publication_year']:
            if not isinstance(validated_data['publication_year'], str):
                if hasattr(validated_data['publication_year'], 'year'):
                    validated_data['publication_year'] = str(validated_data['publication_year'].year)
                else:
                    validated_data['publication_year'] = str(validated_data['publication_year'])
        
        # Create the paper
        paper = ResearchPaper.objects.create(**validated_data)
        
        # Handle authors - ensure we're handling names correctly
        for author_data in authors_data:
            name = author_data.get('name', '').strip()
            if name:  # Only proceed if name is not empty
                affiliation = author_data.get('affiliation', '')
                email = author_data.get('email', None)
                
                # More robust author creation
                try:
                    author, _ = Author.objects.get_or_create(
                        name=name,
                        defaults={
                            'affiliation': affiliation,
                            'email': email
                        }
                    )
                    paper.authors.add(author)
                except Exception as e:
                    print(f"Error creating author {name}: {e}")
                    # Try fallback without affiliation
                    try:
                        author, _ = Author.objects.get_or_create(name=name)
                        paper.authors.add(author)
                    except:
                        pass  # If this fails too, we'll skip the author
        
        # Handle keywords
        for keyword_data in keywords_data:
            keyword_name = keyword_data.get('name', '').strip().lower()
            if keyword_name:  # Only proceed if name is not empty
                keyword, _ = Keyword.objects.get_or_create(name=keyword_name)
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
                name = author_data.get('name', '').strip()
                if name:  # Only proceed if name is not empty
                    author, _ = Author.objects.get_or_create(
                        name=name,
                        defaults={
                            'affiliation': author_data.get('affiliation', ''),
                            'email': author_data.get('email', None)
                        }
                    )
                    instance.authors.add(author)
        
        # Update keywords if provided
        if keywords_data is not None:
            instance.keywords.clear()
            for keyword_data in keywords_data:
                keyword_name = keyword_data.get('name', '').strip().lower()
                if keyword_name:  # Only proceed if name is not empty
                    keyword, _ = Keyword.objects.get_or_create(name=keyword_name)
                    instance.keywords.add(keyword)
        
        return instance
