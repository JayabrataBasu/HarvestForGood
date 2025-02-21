# apps/security/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def email_settings(request):
    return Response({
        'EMAIL_HOST': settings.EMAIL_HOST,
        'EMAIL_PORT': settings.EMAIL_PORT,
        'EMAIL_USE_TLS': settings.EMAIL_USE_TLS,
        'EMAIL_HOST_USER': settings.EMAIL_HOST_USER
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_email(request):
    try:
        send_mail(
            subject=request.data.get('subject'),
            message=request.data.get('message'),
            from_email=settings.EMAIL_HOST_USER,  # Use configured email
            recipient_list=request.data.get('recipient_list'),
            fail_silently=False
        )
        return Response({'status': 'Email sent successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)
