from django.db import models
from django.utils.text import slugify
from apps.utils.fields import YearField
import datetime
from django.utils import timezone

class KeywordCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Keyword Categories"

class Keyword(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(KeywordCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='keywords')
    # Only keep the field that exists in the database
    created_at = models.DateTimeField(null=True, blank=True)
    # Remove the updated_at field since it doesn't exist in the database
    # updated_at = models.DateTimeField(null=True, blank=True)
    # Keep the year fields for user input
    year_created = models.CharField(max_length=4, null=True, blank=True, help_text="Year when the keyword was added")
    year_updated = models.CharField(max_length=4, null=True, blank=True, help_text="Year when the keyword was last updated")
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Keyword"
        verbose_name_plural = "Keywords"

class Author(models.Model):
    name = models.CharField(max_length=100)
    affiliation = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    # Replace datetime fields with simple year-only fields
    year_created = models.CharField(max_length=4, null=True, blank=True, help_text="Year when the author was added")
    year_updated = models.CharField(max_length=4, null=True, blank=True, help_text="Year when the author was last updated")
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Author"
        verbose_name_plural = "Authors"

class ResearchPaper(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    abstract = models.TextField()
    authors = models.ManyToManyField(Author, related_name='papers', blank=True)
    keywords = models.ManyToManyField(Keyword, related_name='papers')
    # Using CharField for publication_year to handle string values
    publication_year = models.CharField(
        max_length=10, 
        verbose_name='Publication Year',
        default='',  # Empty default instead of '2023'
        blank=True,  # Allow blank values
    )
    journal = models.CharField(max_length=255, blank=True)
    doi = models.CharField(max_length=100, blank=True, null=True)
    # This is the download_url field for file downloads
    download_url = models.URLField(blank=True, max_length=500, null=True)
    methodology_type = models.CharField(max_length=50, blank=True, default='Unknown')
    citation_count = models.IntegerField(default=0)
    citation_trend = models.CharField(max_length=20, default='stable', 
                                      choices=[('increasing', 'Increasing'),
                                              ('decreasing', 'Decreasing'),
                                              ('stable', 'Stable')])
    # Add missing fields that are in the serializer
    volume = models.CharField(max_length=50, blank=True, null=True)
    issue = models.CharField(max_length=50, blank=True, null=True)
    pages = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            
        # Ensure we have a string value for publication_year
        if self.publication_year:
            # Convert any non-string types to strings
            if not isinstance(self.publication_year, str):
                # Handle date objects by extracting year
                if hasattr(self.publication_year, 'year'):
                    self.publication_year = str(self.publication_year.year)
                # Handle integer year values
                elif isinstance(self.publication_year, int):
                    self.publication_year = str(self.publication_year)
                else:
                    # Fall back to string conversion
                    self.publication_year = str(self.publication_year)
                    
        # Set default methodology_type if not provided
        if not self.methodology_type:
            self.methodology_type = "Unknown"
            
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
