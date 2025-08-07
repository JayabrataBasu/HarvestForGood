from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def is_valid_email(email: str) -> bool:
    """
    Validate email format using Django's built-in email validator.
    
    Args:
        email (str): The email address to validate
        
    Returns:
        bool: True if email is valid, False otherwise
    """
    if not email or not isinstance(email, str):
        return False
        
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def normalize_email(email: str) -> str:
    """
    Normalize email address (lowercase and strip whitespace).
    
    Args:
        email (str): The email address to normalize
        
    Returns:
        str: Normalized email address
    """
    if not email or not isinstance(email, str):
        return ""
        
    return email.strip().lower()


def is_valid_and_normalized_email(email: str) -> tuple[bool, str]:
    """
    Validate and normalize email in one operation.
    
    Args:
        email (str): The email address to validate and normalize
        
    Returns:
        tuple[bool, str]: (is_valid, normalized_email)
    """
    normalized = normalize_email(email)
    is_valid = is_valid_email(normalized)
    return is_valid, normalized
