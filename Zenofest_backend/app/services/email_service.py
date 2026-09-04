import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

class EmailService:
    def __init__(self, settings):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.org_email = settings.ORGANIZER_EMAIL
    
    def send_registration_confirmation(self, registration, payment):
        """Send registration confirmation email"""
        msg = MIMEMultipart()
        msg["From"] = self.smtp_username
        msg["To"] = registration.leader_email
        msg["Subject"] = f"ZenoFest 2k26 - Registration Confirmation ({registration.registration_id})"
        
        body = f"""
        Dear {registration.leader_name},
        
        Your team registration has been confirmed!
        
        Registration Details:
        - Registration ID: {registration.registration_id}
        - Team Name: {registration.team_name}
        - Event: {registration.event_name}
        - Participants: {registration.total_participants}
        - Total Amount: ₹{registration.total_amount}
        - Payment Status: {payment.payment_status}
        - Payment ID: {payment.razorpay_payment_id}
        
        An invoice has been generated and will be sent to your email.
        
        Thank you for registering ZenoFest 2k26!
        """
        msg.attach(MIMEText(body, "plain"))
        
        try:
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Email send error: {e}")
            return False
    
    def send_invoice_email(self, registration, invoice, pdf_path=None):
        """Send invoice email with PDF attachment"""
        msg = MIMEMultipart()
        msg["From"] = self.smtp_username
        msg["To"] = registration.leader_email
        msg["Subject"] = f"ZenoFest 2k26 - Invoice ({invoice.invoice_number})"
        
        body = f"""
        Dear {registration.leader_name},
        
        Please find your invoice for the ZenoFest 2k26 registration.
        
        Invoice Details:
        - Invoice Number: {invoice.invoice_number}
        - Registration ID: {registration.registration_id}
        - Team Name: {registration.team_name}
        - Event: {registration.event_name}
        - Participants: {registration.total_participants}
        - Total Amount: ₹{invoice.amount}
        - Payment Status: Paid
        
        The invoice PDF is attached to this email.
        
        Thank you for participating in ZenoFest 2k26!
        """
        msg.attach(MIMEText(body, "plain"))
        
        if pdf_path and os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                attachment = MIMEText(f.read(), "application/pdf")
            attachment.add_header('Content-Disposition', 'attachment', filename=os.path.basename(pdf_path))
            msg.attach(attachment)
        
        try:
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Invoice email send error: {e}")
            return False