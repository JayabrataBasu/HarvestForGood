from django import forms
from django.db import models
from django.core.exceptions import ValidationError
import datetime

class YearField(models.Field):
    """
    A custom field to store year values
    """
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 4
        super().__init__(*args, **kwargs)

    def db_type(self, connection):
        # Change to use date type in the database
        return 'date'
    
    def to_python(self, value):
        if value is None:
            return None
            
        # If it's already a date, return it
        if isinstance(value, datetime.date):
            return value
            
        # Try to convert to date if it's an integer
        try:
            year = int(value)
            return datetime.date(year, 1, 1)
        except (ValueError, TypeError):
            raise ValidationError(f"Invalid year value: {value}")
    
    def from_db_value(self, value, expression, connection):
        return self.to_python(value)
    
    def get_prep_value(self, value):
        if value is None:
            return None
            
        # Convert to date for database storage
        if isinstance(value, datetime.date):
            return value
            
        if isinstance(value, int):
            return datetime.date(value, 1, 1)
            
        try:
            year = int(value)
            return datetime.date(year, 1, 1)
        except (ValueError, TypeError):
            raise ValidationError(f"Invalid year value for database: {value}")
    
    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        if isinstance(value, datetime.date):
            return str(value.year)
        return str(value) if value is not None else None

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
