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
# import resend


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
            
            # Add debugging print statements
            print(f"Attempting to send verification email to {user.email}")
            print(f"Using mail host: {os.environ.get('EMAIL_HOST')}")
            print(f"Using mail user: {os.environ.get('EMAIL_HOST_USER')}")
            
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.content_subtype = "html"  # Set content type to html
            result = email.send()
            
            print(f"Email sending result: {result}")
            
            if result == 0:
                print("Warning: Email send returned 0, it may not have been sent")
                
        except Exception as e:
            print(f"Error sending verification email: {str(e)}")
            # Don't raise the exception to prevent registration failure,
            # but log it for debugging purposes

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]



#this is for contact us functionality

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message(request):
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    if not all([name, email, subject, message]):
        return Response({'message': 'All fields are required.'}, status=400)
    try:
        # resend.api_key = os.environ.get("resend.api_key")
        # response = resend.Emails.send({
        #     "from": "Your Name <noreply@yourdomain.com>",  # Use your verified Resend domain
        #     "to": ["jayabratabasu@gmail.com"],  # Or your official email
        #     "subject": f"[Contact] {subject}",
        #     "html": f"<p><b>From:</b> {name} ({email})</p><p>{message}</p>",
        # })
        # if response.get("id"):
        #     return Response({'message': 'Message sent successfully!'})
        # else:
        #     return Response({'message': 'Failed to send message.'}, status=500)
        # Temporarily return a success message for testing
        return Response({'message': 'Message sent successfully!'})
    except Exception as e:
        return Response({'message': f'Failed to send message: {str(e)}'}, status=500)
# ...existing code...



#this is for password reset functionality
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
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
        
        # Add debug logs
        print(f"Attempting to send welcome email to {email}")
        
        # Try sending the email and capture the result
        send_result = email_message.send()
        
        print(f"Email send result: {send_result}")
        
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
        print(f"Error sending welcome email: {str(e)}")
        return Response(
            {'error': f'Failed to send welcome email: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
