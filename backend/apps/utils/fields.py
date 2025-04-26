from django import forms
from django.db import models
from django.core.exceptions import ValidationError

class YearField(models.PositiveIntegerField):
    """
    A model field that stores a year in the database as an integer,
    but displays it as a year.
    """
    description = "Year"
    
    def __init__(self, *args, **kwargs):
        # Override default form field
        kwargs['verbose_name'] = kwargs.get('verbose_name', 'Year')
        super().__init__(*args, **kwargs)
    
    def formfield(self, **kwargs):
        # Use a custom form field
        defaults = {'form_class': YearFormField}
        defaults.update(kwargs)
        return super().formfield(**defaults)

class YearFormField(forms.IntegerField):
    """
    A form field for inputting a year only.
    """
    def __init__(self, *args, **kwargs):
        kwargs['min_value'] = 1900
        kwargs['max_value'] = 2100
        kwargs['help_text'] = kwargs.get('help_text', 'Enter a year between 1900-2100')
        super().__init__(*args, **kwargs)
    
    def validate(self, value):
        super().validate(value)
        if value and (value < 1900 or value > 2100):
            raise ValidationError('Year must be between 1900 and 2100')
