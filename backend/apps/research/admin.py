from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
import datetime
from django.db.models import DateField
from .models import ResearchPaper, Author, Keyword

class ResearchPaperAdminForm(forms.ModelForm):
    """
    Custom form for ResearchPaper admin to handle publication_year as integer input
    that gets converted to a date object.
    """
    # Use an integer field in the form 
    publication_year = forms.IntegerField(
        min_value=1900,
        max_value=datetime.date.today().year,
        help_text="Enter the publication year (e.g., 2023)"
    )
    
    # Add a simple text field for comma-separated author names
    author_names = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text="Enter author names separated by commas (e.g., 'John Smith, Jane Doe')"
    )
    
    # Add a simple text field for comma-separated keywords
    keyword_names = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 2}),
        help_text="Enter keywords separated by commas (e.g., 'agriculture, sustainability')"
    )
    
    class Meta:
        model = ResearchPaper
        fields = '__all__'
        exclude = ['authors', 'keywords']  # We'll handle these manually
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If we're editing an existing instance, convert date to year integer
        if self.instance and self.instance.pk:
            if hasattr(self.instance, 'publication_year') and isinstance(self.instance.publication_year, datetime.date):
                self.initial['publication_year'] = self.instance.publication_year.year
            
            # Pre-populate author_names field
            if self.instance.authors.exists():
                self.initial['author_names'] = ', '.join([author.name for author in self.instance.authors.all()])
            
            # Pre-populate keyword_names field
            if self.instance.keywords.exists():
                self.initial['keyword_names'] = ', '.join([keyword.name for keyword in self.instance.keywords.all()])
    
    def clean_publication_year(self):
        """Convert the integer year to a date object (January 1st of the year)"""
        year = self.cleaned_data.get('publication_year')
        if year:
            return datetime.date(year, 1, 1)  # January 1st of the provided year
        return None
    
    def save(self, commit=True):
        """
        Override the save method to ensure proper date conversion before saving
        and handle authors and keywords.
        """
        # Get the year value but don't remove it from cleaned_data
        publication_year_value = self.cleaned_data.get('publication_year')
        
        # Don't save M2M relationships yet
        model = super().save(commit=False)
        
        # Set publication_year as a proper date object
        if publication_year_value:
            if isinstance(publication_year_value, int):
                model.publication_year = datetime.date(publication_year_value, 1, 1)
            elif isinstance(publication_year_value, datetime.date):
                model.publication_year = publication_year_value
        
        # Save the main model first
        if commit:
            # Save the model with the correct date type
            model.save()
            
            # Process author names and create/retrieve Author objects
            author_names = self.cleaned_data.get('author_names', '')
            if author_names:
                # Clear existing authors first
                model.authors.clear()
                
                # Process each author name
                for name in [n.strip() for n in author_names.split(',') if n.strip()]:
                    # Get or create author with current timestamp
                    try:
                        author, created = Author.objects.get_or_create(
                            name=name,
                            defaults={
                                'created_at': datetime.datetime.now(),
                                'updated_at': datetime.datetime.now()
                            }
                        )
                        model.authors.add(author)
                    except Exception as e:
                        # If Author model doesn't have these fields, try a simpler approach
                        try:
                            author, created = Author.objects.get_or_create(name=name)
                            model.authors.add(author)
                        except Exception as e2:
                            # Last resort
                            print(f"Error adding author {name}: {str(e2)}")
            
            # Process keyword names and create/retrieve Keyword objects
            keyword_names = self.cleaned_data.get('keyword_names', '')
            if keyword_names:
                # Clear existing keywords first
                model.keywords.clear()
                
                # Process each keyword
                for name in [n.strip() for n in keyword_names.split(',') if n.strip()]:
                    # Get or create keyword with current timestamp
                    try:
                        keyword, created = Keyword.objects.get_or_create(
                            name=name.lower(),
                            defaults={
                                'created_at': datetime.datetime.now(),
                                'updated_at': datetime.datetime.now()
                            }
                        )
                        model.keywords.add(keyword)
                    except Exception as e:
                        # If Keyword model doesn't have these fields, try a simpler approach
                        try:
                            keyword, created = Keyword.objects.get_or_create(name=name.lower())
                            model.keywords.add(keyword)
                        except Exception as e2:
                            # Last resort
                            print(f"Error adding keyword {name}: {str(e2)}")
            
            # Save many-to-many relationships
            self.save_m2m()
        
        return model

# Optional: Register these models if you still want separate admin interfaces for them
@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'affiliation', 'email']
    search_fields = ['name', 'affiliation']
    
    def save_model(self, request, obj, form, change):
        # Set created_at and updated_at fields if they exist and are not set
        if hasattr(obj, 'created_at') and not obj.created_at:
            obj.created_at = datetime.datetime.now()
        if hasattr(obj, 'updated_at'):
            obj.updated_at = datetime.datetime.now()
        super().save_model(request, obj, form, change)

@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    
    def save_model(self, request, obj, form, change):
        # Set created_at and updated_at fields if they exist and are not set
        if hasattr(obj, 'created_at') and not obj.created_at:
            obj.created_at = datetime.datetime.now()
        if hasattr(obj, 'updated_at'):
            obj.updated_at = datetime.datetime.now()
        super().save_model(request, obj, form, change)

@admin.register(ResearchPaper)
class ResearchPaperAdmin(admin.ModelAdmin):
    form = ResearchPaperAdminForm
    list_display = ['title', 'get_authors', 'display_publication_year', 'journal']
    search_fields = ['title', 'abstract', 'authors__name', 'journal']
    list_filter = ['publication_year', 'journal']
    
    def get_authors(self, obj):
        return ", ".join([author.name for author in obj.authors.all()])
    get_authors.short_description = 'Authors'
    
    def display_publication_year(self, obj):
        """Display the year portion of the publication_year date field"""
        if obj.publication_year:
            if isinstance(obj.publication_year, datetime.date):
                return obj.publication_year.year
            return obj.publication_year
        return None
    display_publication_year.short_description = 'Publication Year'
    
    def save_model(self, request, obj, form, change):
        """
        Additional safety check before saving the model
        """
        # Ensure publication_year is a date object before saving
        if hasattr(obj, 'publication_year'):
            if isinstance(obj.publication_year, int):
                obj.publication_year = datetime.date(obj.publication_year, 1, 1)
            elif not isinstance(obj.publication_year, datetime.date) and obj.publication_year is not None:
                try:
                    year = int(obj.publication_year)
                    obj.publication_year = datetime.date(year, 1, 1)
                except (ValueError, TypeError):
                    # Default to current year if conversion fails
                    obj.publication_year = datetime.date.today().replace(month=1, day=1)
        
        super().save_model(request, obj, form, change)
