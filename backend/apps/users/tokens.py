# apps/users/tokens.py
# apps/users/tokens.py
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.email_verified}"

email_verification_token = EmailVerificationTokenGenerator()
