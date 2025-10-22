import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.settings import settings
from typing import Optional

def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

async def send_otp_email(email: str, otp: str, name: Optional[str] = None) -> bool:
    """
    Send OTP via email
    Automatically uses SMTP if configured, otherwise prints to console
    """
    try:
        # Check if SMTP is configured
        smtp_configured = all([
            settings.SMTP_HOST, 
            settings.SMTP_PORT, 
            settings.SMTP_USER, 
            settings.SMTP_PASSWORD
        ])
        
        if smtp_configured:
            # Send via SMTP
            print(f"Sending OTP email to {email}...")
            
            message = MIMEMultipart("alternative")
            message["Subject"] = "Your Aero GenV Verification Code"
            message["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
            message["To"] = email
            
            # Create HTML email
            html = f'''
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #000; text-align: center;">Aero GenV</h2>
                  <h3 style="color: #333;">Email Verification</h3>
                  <p style="color: #666;">Hello{' ' + name if name else ''},</p>
                  <p style="color: #666;">Thank you for signing up! Please use the following verification code to complete your registration:</p>
                  <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #000; letter-spacing: 8px; margin: 0;">{otp}</h1>
                  </div>
                  <p style="color: #666;">This code will expire in 10 minutes.</p>
                  <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                  <p style="color: #999; font-size: 12px; text-align: center;">Aero GenV - RC Aircraft Club</p>
                </div>
              </body>
            </html>
            '''
            
            text = f'''
Aero GenV - Email Verification

Hello{' ' + name if name else ''},

Thank you for signing up! Your verification code is:

{otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

---
Aero GenV - RC Aircraft Club
            '''
            
            part1 = MIMEText(text, "plain")
            part2 = MIMEText(html, "html")
            
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(message)
            
            print(f"✓ OTP email sent successfully to {email}")
            return True
        else:
            # Fallback to console for development
            print(f"\n{'='*50}")
            print(f"📧 OTP Email (Console Mode - SMTP not configured)")
            print(f"{'='*50}")
            print(f"To: {email}")
            print(f"Name: {name or 'N/A'}")
            print(f"OTP Code: {otp}")
            print(f"{'='*50}\n")
            return True
            
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        # Fallback to console if SMTP fails
        print(f"\n{'='*50}")
        print(f"📧 OTP Email (Fallback Mode - SMTP failed)")
        print(f"{'='*50}")
        print(f"To: {email}")
        print(f"Name: {name or 'N/A'}")
        print(f"OTP Code: {otp}")
        print(f"{'='*50}\n")
        return True
