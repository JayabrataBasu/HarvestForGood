from django import forms
from .models import ResearchPaper

class ResearchPaperForm(forms.ModelForm):
    class Meta:
        model = ResearchPaper
        fields = ['title', 'abstract', 'authors', 'publication_year', 'journal']
        widgets = {
            'publication_year': forms.NumberInput(attrs={'placeholder': 'YYYY'}),
        }
        labels = {
            'publication_year': 'Year',
        }
        help_texts = {
            'publication_year': 'Enter publication year (e.g., 2023)',
        }
