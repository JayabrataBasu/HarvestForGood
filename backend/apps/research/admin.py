from django.contrib import admin
from .models import ResearchPaper, Author, Keyword

@admin.register(ResearchPaper)
class ResearchPaperAdmin(admin.ModelAdmin):
    list_display = ['title', 'get_authors', 'publication_year', 'journal']
    search_fields = ['title', 'abstract', 'authors__name', 'journal']
    list_filter = ['publication_year', 'journal']
    
    def get_authors(self, obj):
        return ", ".join([author.name for author in obj.authors.all()])
    get_authors.short_description = 'Authors'

# ... register other models ...
