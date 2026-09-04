from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import ContactMessage
from app.schemas import contact
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/contact", tags=["contact"])

def send_email(name, email, subject, message, organizer_email):
    organizer_email = organizer_email or settings.ORGANIZER_EMAIL
    
    msg = MIMEMultipart()
    msg["From"] = email
    msg["To"] = organizer_email
    msg["Subject"] = subject
    
    body = f"Name: {name}\nEmail: {email}\nSubject: {subject}\nMessage: {message}"
    msg.attach(MIMEText(body, "plain"))
    
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

@router.post("/")
def submit_contact(
    contact_data: contact.ContactCreate,
    db: Session = Depends(get_db)
):
    if len(contact_data.message) < 5:
        raise HTTPException(status_code=400, detail="Message too short")
    if len(contact_data.message) > 500:
        raise HTTPException(status_code=400, detail="Message too long")
    
    db_contact = ContactMessage(
        name=contact_data.name,
        email=contact_data.email,
        phone=contact_data.phone,
        subject=contact_data.subject,
        message=contact_data.message,
        status="NEW"
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    send_email(
        name=contact_data.name,
        email=contact_data.email,
        subject=contact_data.subject,
        message=contact_data.message,
        organizer_email=settings.ORGANIZER_EMAIL
    )
    
    return {"status": "success", "message": "Contact form submitted successfully"}
