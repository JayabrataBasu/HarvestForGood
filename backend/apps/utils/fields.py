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
        return 'integer'
    
    def to_python(self, value):
        if value is None:
            return None
            
        try:
            return int(value)
        except (ValueError, TypeError):
            if isinstance(value, datetime.date):
                return value.year
            raise
    
    def from_db_value(self, value, expression, connection):
        return self.to_python(value)
    
    def get_prep_value(self, value):
        if value is None:
            return None
            
        # Handle datetime.date objects
        if isinstance(value, datetime.date):
            return value.year
            
        return int(value)
    
    def value_to_string(self, obj):
        value = self.value_from_object(obj)
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
