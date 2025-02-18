# apps/forum/validators.py
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MaxLengthValidator
import re

def validate_post_content(value):
    if len(value.strip()) < 10:
        raise ValidationError('Content must be at least 10 characters long.')
    if len(value) > 5000:
        raise ValidationError('Content cannot exceed 5000 characters.')

def validate_title(value):
    if len(value.strip()) < 5:
        raise ValidationError('Title must be at least 5 characters long.')
    if len(value) > 200:
        raise ValidationError('Title cannot exceed 200 characters.')
    if not re.match(r'^[\w\s.,!?()-]+$', value):
        raise ValidationError('Title contains invalid characters.')
