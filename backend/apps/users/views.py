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
            mail_subject = 'Verify your email address'
            message = render_to_string('users/email_verification.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': email_verification_token.make_token(user),
            })
            
            # Remove sensitive logging - only log general status
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.content_subtype = "html"  # Set content type to html
            result = email.send()
            
            if result == 0:
                # Log warning without sensitive data
                pass
                
        except Exception as e:
            # Don't raise the exception to prevent registration failure,
            # but log it for debugging purposes
            pass

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]



#this is for contact us functionality

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message(request):
    # Use the new validation utility
    validation_error = validate_contact_fields(request.data)
    if validation_error:
        return validation_error
    
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    
    try:
        # Format the email content with better structure
        email_subject = f"[Contact Form] {subject}"
        email_message = f"""
Contact Form Submission - Harvest For Good

FROM: {name} <{email}>
SUBJECT: {subject}

MESSAGE:
{message}

---
Reply to: {email}
Submitted via: Harvest For Good Contact Form
Timestamp: {request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'Unknown'))}
        """.strip()
        
        # Use EmailMessage instead of send_mail to support reply-to functionality
        email_obj = EmailMessage(
            subject=email_subject,
            body=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,  # Always use configured domain
            to=['harvestforgood01@gmail.com'],
            reply_to=[email],  # Set reply-to to the user's email address
        )
        
        # Send the email
        email_obj.send(fail_silently=False)
        
        return Response({'message': 'Message sent successfully!'}, status=200)
        
    except Exception as e:
        return Response({'message': f'Failed to send message: {str(e)}'}, status=500)

# ...existing code...



#this is for password reset functionality
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    # Use the new validation utility
    validation_error = validate_password_reset_fields(request.data)
    if validation_error:
        return validation_error
    
    email = request.data.get('email')
    
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        current_site = get_current_site(request)
        mail_subject = 'Password Reset Request'
        message = render_to_string('users/password_reset_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': default_token_generator.make_token(user),
        })
        email = EmailMessage(mail_subject, message, to=[email])
        email.send()
        return Response(
            {'message': 'Password reset email has been sent.'},
            status=status.HTTP_200_OK
        )
    return Response(
        {'error': 'Email address not found.'},
        status=status.HTTP_404_NOT_FOUND
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
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
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and email_verification_token.check_token(user, token):
        user.email_verified = True
        user.save()
        return Response(
            {'message': 'Email verified successfully.'},
            status=status.HTTP_200_OK
        )
    return Response(
        {'error': 'Invalid verification link.'},
        status=status.HTTP_400_BAD_REQUEST
    )

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
