"""
Email service using Resend HTTP API for reliable, non-blocking email delivery.
This replaces Django's SMTP backend to avoid timeout issues on Railway.
"""
import os
import logging
import resend
from typing import List, Optional

logger = logging.getLogger(__name__)

# Initialize Resend with API key from environment
resend.api_key = os.getenv('RESEND_API_KEY', os.getenv('EMAIL_HOST_PASSWORD'))

def send_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    from_email: Optional[str] = None,
    reply_to: Optional[str] = None
) -> dict:
    """
    Send email using Resend HTTP API.
    
    Args:
        to_emails: List of recipient email addresses
        subject: Email subject line
        html_content: HTML email body
        from_email: Sender email (defaults to DEFAULT_FROM_EMAIL)
        reply_to: Reply-to email address
        
    Returns:
        dict: Response from Resend API with 'id' if successful
        
    Raises:
        Exception: If email fails to send
    """
    if not from_email:
        from_email = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@harvestforgood.org')
    
    try:
        params = {
            "from": from_email,
            "to": to_emails,
            "subject": subject,
            "html": html_content,
        }
        
        if reply_to:
            params["reply_to"] = reply_to
        
        logger.info(f"Sending email via Resend API to {to_emails}")
        response = resend.Emails.send(params)
        logger.info(f"Email sent successfully: {response}")
        
        return response
        
    except Exception as e:
        logger.error(f"Failed to send email via Resend: {e}")
        raise


def send_contact_form_email(name: str, email: str, message: str) -> dict:
    """Send contact form submission to admins."""
    admin_email = os.getenv('ADMIN_EMAIL', 'contact@harvestforgood.org')
    
    html_content = f"""
    <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {name} ({email})</p>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
        </body>
    </html>
    """
    
    return send_email(
        to_emails=[admin_email],
        subject=f"Contact Form: {name}",
        html_content=html_content,
        reply_to=email
    )


def send_password_reset_email(email: str, reset_link: str) -> dict:
    """Send password reset email to user."""
    html_content = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password for Harvest For Good.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{reset_link}">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 24 hours.</p>
        </body>
    </html>
    """
    
    return send_email(
        to_emails=[email],
        subject="Reset Your Password - Harvest For Good",
        html_content=html_content
    )


def send_welcome_email(email: str, username: str) -> dict:
    """Send welcome email to newly registered user."""
    html_content = f"""
    <html>
        <body>
            <h2>Welcome to Harvest For Good, {username}!</h2>
            <p>Thank you for joining our community.</p>
            <p>We're excited to have you on board and look forward to your contributions.</p>
            <p>Get started by exploring our research papers and forum discussions.</p>
            <p>Best regards,<br>The Harvest For Good Team</p>
        </body>
    </html>
    """
    
    return send_email(
        to_emails=[email],
        subject="Welcome to Harvest For Good!",
        html_content=html_content
    )
