from typing import Dict, Optional, Any
from rest_framework.response import Response
from rest_framework import status
from .email import is_valid_email


def validate_fields(data: dict, field_specs: dict) -> Optional[Response]:
    """
    Generalized field validator for DRF API views.

    Args:
        data (dict): Dictionary containing input data.
        field_specs (dict): Dict specifying field requirements, e.g.:
            {
                'email': {'required': True, 'type': 'email'},
                'name': {'required': True},
                'subject': {'required': False},
                'message': {'required': True}
            }

    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid.
    """
    missing_fields = []
    empty_fields = []
    invalid_email_fields = []

    for field, spec in field_specs.items():
        required = spec.get('required', False)
        field_type = spec.get('type', None)
        value = data.get(field, '')

        # Check for missing required fields
        if required and field not in data:
            missing_fields.append(field)
            continue

        # Check for empty required fields
        if required and (not isinstance(value, str) or not value.strip()):
            empty_fields.append(field)
            continue

        # Email validation
        if field_type == 'email' and value:
            if not is_valid_email(value):
                invalid_email_fields.append(field)

    if missing_fields:
        return Response(
            {'error': f"Missing required fields: {', '.join(missing_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if empty_fields:
        return Response(
            {'error': f"The following fields cannot be empty: {', '.join(empty_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if invalid_email_fields:
        return Response(
            {'error': f"Invalid email format for: {', '.join(invalid_email_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # All validations passed
    return None


def validate_contact_fields(data: dict) -> Optional[Response]:
    """
    Validate contact form fields for DRF API views.
    Uses the generalized validate_fields function.
    
    Args:
        data (dict): Dictionary containing contact form data
        
    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid
    """
    field_specs = {
        'name': {'required': True},
        'email': {'required': True, 'type': 'email'},
        'subject': {'required': True},
        'message': {'required': True}
    }
    
    # First run basic validation
    basic_validation = validate_fields(data, field_specs)
    if basic_validation:
        return basic_validation
    
    # Additional length validations specific to contact form
    if len(data.get('name', '').strip()) < 2:
        return Response(
            {'error': 'Name must be at least 2 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('subject', '').strip()) < 5:
        return Response(
            {'error': 'Subject must be at least 5 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('message', '').strip()) < 10:
        return Response(
            {'error': 'Message must be at least 10 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check maximum lengths
    if len(data.get('name', '')) > 100:
        return Response(
            {'error': 'Name cannot exceed 100 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('subject', '')) > 200:
        return Response(
            {'error': 'Subject cannot exceed 200 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('message', '')) > 5000:
        return Response(
            {'error': 'Message cannot exceed 5000 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return None


def validate_password_reset_fields(data: dict) -> Optional[Response]:
    """
    Validate password reset request fields.
    Uses the generalized validate_fields function.
    
    Args:
        data (dict): Dictionary containing password reset data
        
    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid
    """
    field_specs = {
        'email': {'required': True, 'type': 'email'}
    }
    
    return validate_fields(data, field_specs)


def validate_password_reset_confirm_fields(data: dict) -> Optional[Response]:
    """
    Validate password reset confirmation fields.
    
    Args:
        data (dict): Dictionary containing password reset confirmation data
        
    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid
    """
    field_specs = {
        'new_password': {'required': True}
    }
    
    # Basic validation
    basic_validation = validate_fields(data, field_specs)
    if basic_validation:
        return basic_validation
    
    # Password strength validation
    password = data.get('new_password', '')
    
    if len(password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not any(c.isupper() for c in password):
        return Response(
            {'error': 'Password must contain at least one uppercase letter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not any(c.islower() for c in password):
        return Response(
            {'error': 'Password must contain at least one lowercase letter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not any(c.isdigit() for c in password):
        return Response(
            {'error': 'Password must contain at least one number'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return None


def validate_guest_fields(data: dict, required_fields: list = None) -> Optional[Response]:
    """
    Validate guest user fields for forum posts/comments.
    
    Args:
        data (dict): Dictionary containing guest user data
        required_fields (list): List of required field names
        
    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid
    """
    if required_fields is None:
        required_fields = ['guest_name', 'guest_affiliation']
    
    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return Response(
            {'error': f'Missing required fields: {", ".join(missing_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check for empty fields
    empty_fields = [field for field in required_fields if not data.get(field, '').strip()]
    if empty_fields:
        return Response(
            {'error': f'The following fields cannot be empty: {", ".join(empty_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate guest email if provided
    if 'guest_email' in data and data.get('guest_email'):
        if not is_valid_email(data.get('guest_email', '')):
            return Response(
                {'error': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Field length validations
    if len(data.get('guest_name', '').strip()) < 2:
        return Response(
            {'error': 'Guest name must be at least 2 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('guest_name', '')) > 100:
        return Response(
            {'error': 'Guest name cannot exceed 100 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(data.get('guest_affiliation', '')) > 200:
        return Response(
            {'error': 'Guest affiliation cannot exceed 200 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return None


def validate_required_fields(data: dict, fields: list, field_name: str = "field") -> Optional[Response]:
    """
    Generic validator for checking required fields.
    
    Args:
        data (dict): Dictionary containing data to validate
        fields (list): List of required field names
        field_name (str): Singular name for field type (for error messages)
        
    Returns:
        Optional[Response]: DRF Response with 400 error if validation fails, None if valid
    """
    # Check for missing fields
    missing_fields = [field for field in fields if field not in data]
    if missing_fields:
        return Response(
            {'error': f'Missing required {field_name}s: {", ".join(missing_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check for empty fields
    empty_fields = [field for field in fields if not data.get(field, '').strip()]
    if empty_fields:
        return Response(
            {'error': f'The following {field_name}s cannot be empty: {", ".join(empty_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return None
