from django.db import models
from django.utils.text import slugify
from apps.utils.fields import YearField

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
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Keyword"
        verbose_name_plural = "Keywords"

class Author(models.Model):
    name = models.CharField(max_length=100)
    # These fields already exist in the database and were added via a separate process
    # They're included in migration 0002_add_author_fields as a no-op migration
    affiliation = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Author"
        verbose_name_plural = "Authors"

class ResearchPaper(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    abstract = models.TextField()
    authors = models.ManyToManyField(Author, related_name='papers')
    keywords = models.ManyToManyField(Keyword, related_name='papers')
    # Using YearField for publication_year
    publication_year = YearField()
    journal = models.CharField(max_length=255, blank=True)
    doi = models.CharField(max_length=100, blank=True, null=True)
    # This is the download_url field for file downloads
    download_url = models.URLField(blank=True, max_length=500, null=True)
    methodology_type = models.CharField(max_length=50, blank=True)
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
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
