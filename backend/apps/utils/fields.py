from django import forms
from django.db import models
from django.core.exceptions import ValidationError
import datetime

class YearField(models.CharField):
    """
    A CharField that validates and converts year data - can handle int, string, or date objects.
    """
    description = "Year field that can handle various formats"

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 10)
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        if value is None:
            return value
            
        # If already a string, return it
        if isinstance(value, str):
            return value
            
        # If it's an integer, convert to string
        if isinstance(value, int):
            return str(value)
            
        # If it's a date, extract the year
        if isinstance(value, datetime.date):
            return str(value.year)
            
        # Try to convert other values to string
        try:
            return str(value)
        except Exception:
            raise ValidationError("Invalid year format")
            
    def from_db_value(self, value, expression, connection):
        return self.to_python(value)
        
    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if value is None:
            return value
            
        # Ensure we store it as a string
        return str(value)

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
