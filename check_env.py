import os
from dotenv import load_dotenv

load_dotenv()

# Print debug environment variable and its interpretation
debug_env = os.getenv('DEBUG', 'True')
debug_value = debug_env.lower() == 'true'

print(f"DEBUG environment variable is: '{debug_env}'")
print(f"DEBUG evaluates to: {debug_value}")

# Check other important settings
print(f"DJANGO_SECRET_KEY exists: {'Yes' if os.getenv('DJANGO_SECRET_KEY') else 'No'}")
print(f"Database settings:")
print(f" - DB_NAME: {os.getenv('DB_NAME', 'Not set')}")
print(f" - DB_USER: {os.getenv('DB_USER', 'Not set')}")
