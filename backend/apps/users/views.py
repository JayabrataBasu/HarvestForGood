from django.shortcuts import render
from rest_framework import viewsets, status
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from .tokens import email_verification_token
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
import os
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .utils.email import is_valid_email
from .utils.validation import validate_contact_fields, validate_password_reset_fields
from rest_framework.throttling import ScopedRateThrottle
import logging

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.send_verification_email(user)
        return user

    def send_verification_email(self, user):
        try:
            current_site = get_current_site(self.request)
            mail_subject = 'Welcome to Harvest For Good – Verify Your Account'
            # Use new HTML template
            message = render_to_string('users/account_verification_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': default_token_generator.make_token(user),
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.content_subtype = "html"
            email.send()
        except Exception:
            pass

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]



#this is for contact us functionality

# Replace the entire password_reset_request function (around line 117)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Custom password reset request handler with proper error handling"""
    import logging
    
    try:
        # Use the validation utility
        validation_error = validate_password_reset_fields(request.data)
        if validation_error:
            return validation_error
        
        email = request.data.get('email')
        logger = logging.getLogger(__name__)
        
        # Always return success to prevent email enumeration attacks
        try:
            user = User.objects.get(email=email)
            
            # Generate frontend reset link using configurable FRONTEND_URL
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Get FRONTEND_URL from settings
            frontend_url = getattr(settings, 'FRONTEND_URL', 'https://harvestforgood.vercel.app')
            reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"
            
            # Log for debugging (remove in production)
            logger.info(f"Generated reset link: {reset_link}")
            
            mail_subject = 'Password Reset Request - Harvest For Good'
            
            # Render email template
            try:
                message_html = render_to_string('users/password_reset_email.html', {
                    'user': user,
                    'reset_link': reset_link,
                    'current_year': 2025,
                })
                
                email_obj = EmailMessage(
                    subject=mail_subject, 
                    body=message_html, 
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[email]
                )
                email_obj.content_subtype = "html"
                
                # Send email with proper error handling
                send_result = email_obj.send(fail_silently=False)
                
                if send_result == 1:
                    logger.info(f"Password reset email sent successfully to {email}")
                else:
                    logger.error(f"Email failed to send to {email} - send_result: {send_result}")
                
            except Exception as email_error:
                logger.error(f"Email sending error for {email}: {str(email_error)}")
                # Continue to return success to prevent information disclosure
                
        except User.DoesNotExist:
            # User doesn't exist, but don't reveal this information
            logger.info(f"Password reset requested for non-existent email: {email}")
            pass
        
        # Always return success message
        return Response(
            {'message': 'If an account with this email exists, a password reset link has been sent.'},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        logger.error(f"Password reset request error: {str(e)}")
        return Response(
            {'error': 'An error occurred processing your request. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
    except Exception as e:
        # Log the error for debugging
        print(f"Password reset request error: {e}")
        return Response(
            {'error': 'An error occurred processing your request. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    """Custom password reset confirm handler - THIS IS THE ACTIVE VIEW"""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        new_password = request.data.get('new_password')
        if new_password:
            user.set_password(new_password)
            user.save()
            return Response(
                {'message': 'Password has been reset successfully.'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'error': 'New password is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(
        {'error': 'Invalid reset link.'},
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    """
    API endpoint to verify user email.
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        from .models import User
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'detail': 'Invalid link.'}, status=400)

    if default_token_generator.check_token(user, token):
        user.email_verified = True
        user.is_active = True
        user.save()
        return Response({'detail': 'success'})
    return Response({'detail': 'Invalid or expired verification link.'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification_email(request):
    user = request.user
    if not user.email_verified:
        current_site = get_current_site(request)
        mail_subject = 'Verify your email address'
        # Fix the template path to include the 'users/' directory
        message = render_to_string('users/email_verification.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': email_verification_token.make_token(user),
        })
        email = EmailMessage(mail_subject, message, to=[user.email])
        email.content_subtype = "html"  # Set content type to html
        email.send()
        return Response(
            {'message': 'Verification email has been resent.'},
            status=status.HTTP_200_OK
        )
    return Response(
        {'message': 'Email is already verified.'},
        status=status.HTTP_400_BAD_REQUEST
    )

class MeView(APIView):
    """
    View to retrieve the currently authenticated user's information
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Return the authenticated user's details
        """
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_welcome_email(request):
    """
    Send a welcome email to a newly registered user
    """
    try:
        email = request.data.get('email')
        
        # Use the reusable email validation utility
        if not is_valid_email(email):
            return Response(
                {'error': 'Invalid email format.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.get(email=email)
        
        # Generate verification token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)
        
        current_site = get_current_site(request)
        mail_subject = 'Welcome to Harvest For Good!'
        message = render_to_string('users/welcome_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': uid,
            'token': token,
        })
        
        email_message = EmailMessage(mail_subject, message, to=[email])
        email_message.content_subtype = "html"
        
        # Try sending the email and capture the result
        send_result = email_message.send()
        
        if send_result > 0:
            return Response(
                {'message': 'Welcome email has been sent successfully.'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Failed to send welcome email. Email system returned 0.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'User with this email does not exist.'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to send welcome email: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        return Response(
            {'error': 'User with this email does not exist.'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to send welcome email: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
