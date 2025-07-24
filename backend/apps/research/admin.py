from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
import datetime
from django.db.models import DateField
from .models import ResearchPaper, Author, Keyword
from django.core.validators import RegexValidator
from django.utils import timezone
from django.contrib import messages

class ResearchPaperAdminForm(forms.ModelForm):
    """
    Custom form for ResearchPaper admin to handle publication_year as a string
    """
    # Use a CharField with numeric validation instead of IntegerField
    publication_year = forms.CharField(
        max_length=10,
        help_text="Enter the publication year (e.g., 2023)",
        validators=[
            RegexValidator(
                regex=r'^\d{4}$',
                message='Enter a valid 4-digit year',
                code='invalid_year'
            )
        ]
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
        # If we're editing an existing instance, ensure year is a string
        if self.instance and self.instance.pk:
            if hasattr(self.instance, 'publication_year'):
                if isinstance(self.instance.publication_year, (int, datetime.date)):
                    year = self.instance.publication_year.year if hasattr(self.instance.publication_year, 'year') else self.instance.publication_year
                    self.initial['publication_year'] = str(year)
                else:
                    self.initial['publication_year'] = str(self.instance.publication_year)
            
            # Pre-populate author_names field
            if self.instance.authors.exists():
                self.initial['author_names'] = ', '.join([author.name for author in self.instance.authors.all()])
            
            # Pre-populate keyword_names field
            if self.instance.keywords.exists():
                self.initial['keyword_names'] = ', '.join([keyword.name for keyword in self.instance.keywords.all()])
    
    def clean_publication_year(self):
        """Keep the year as a string"""
        year = self.cleaned_data.get('publication_year')
        if year:
            # Simple validation to ensure it's a valid year
            try:
                year_int = int(year)
                if year_int < 1000 or year_int > 9999:
                    raise forms.ValidationError("Please enter a valid 4-digit year")
            except ValueError:
                raise forms.ValidationError("Please enter a valid year")
            return year
        return None
    
    def save(self, commit=True):
        """
        Override the save method to handle publication_year as a string
        """
        # Don't save M2M relationships yet
        model = super().save(commit=False)
        
        # Publication year is already a string from clean_publication_year
        
        # Save the main model first
        if commit:
            # Save the model with the correct date type
            model.save()
            
            # Process author names and create/retrieve Author objects
            author_names = self.cleaned_data.get('author_names', '')
            if author_names:
                # Clear existing authors first
                model.authors.clear()
                
                # Process each author
                for name in [n.strip() for n in author_names.split(',') if n.strip()]:
                    try:
                        # Get or create author with current timestamp
                        author, created = Author.objects.get_or_create(
                            name=name,
                            defaults={}
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
                    try:
                        # Get or create keyword with current timestamp
                        keyword, created = Keyword.objects.get_or_create(
                            name=name.lower(),
                            defaults={}
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
        # Prevent saving if affiliation is missing
        if not obj.affiliation:
            messages.error(request, "Affiliation is required and cannot be blank.")
            raise ValidationError("Affiliation is required and cannot be blank.")

        # Prevent duplicate (name, affiliation)
        if not change:
            model = type(obj)
            if model.objects.filter(name=obj.name, affiliation=obj.affiliation).exists():
                messages.error(request, f"Author with name '{obj.name}' and affiliation '{obj.affiliation}' already exists.")
                raise ValidationError(f"Author with name '{obj.name}' and affiliation '{obj.affiliation}' already exists.")

        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)
    
@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'year_created', 'year_updated']
    search_fields = ['name']
    list_filter = ['category']
    
    def save_model(self, request, obj, form, change):
        # Set the created_at field to keep the database happy
        if not obj.created_at:
            obj.created_at = timezone.now()
        
        # Remove this line since updated_at field doesn't exist
        # obj.updated_at = timezone.now()
        
        # If year fields are provided, use them
        current_year = str(timezone.now().year)
        if not obj.year_created:
            obj.year_created = current_year
        if not obj.year_updated:
            obj.year_updated = current_year
            
        super().save_model(request, obj, form, change)

# Add a custom AuthorInline to properly handle author relationships
class AuthorInline(admin.TabularInline):
    model = ResearchPaper.authors.through
    extra = 1
    autocomplete_fields = ['author'] # If you have many authors

@admin.register(ResearchPaper)
class ResearchPaperAdmin(admin.ModelAdmin):
    form = ResearchPaperAdminForm
    list_display = ['title', 'get_authors', 'publication_year', 'journal']
    search_fields = ['title', 'abstract', 'authors__name', 'journal']
    list_filter = ['journal']
    
    # Add the authors inline and exclude the main field to avoid duplication
    inlines = [AuthorInline]
    exclude = ('authors',)  # This prevents duplicate author fields
    
    def get_authors(self, obj):
        return ", ".join([author.name for author in obj.authors.all()])
    get_authors.short_description = 'Authors'
    
    def save_model(self, request, obj, form, change):
        """
        Just save the model with publication_year as a string
        """
        # publication_year should already be a string from the form
        super().save_model(request, obj, form, change)
