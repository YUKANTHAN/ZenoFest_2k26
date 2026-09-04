from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database import get_db, SessionLocal
from app.config import settings, eventsData
from app.models import Registration, Participant, Payment, ContactMessage, Invoice
from app.schemas import registration, lookup
import razorpay
import uuid
import hashlib
import hmac
from datetime import datetime

router = APIRouter(prefix="/registrations", tags=["registrations"])

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/")
def create_registration(
    reg_data: registration.RegistrationCreate,
    db: Session = Depends(get_db)
):
    event_code = reg_data.event_code
    event_found = False
    for event in eventsData:
        if event["id"] == event_code:
            event_found = True
            break
    if not event_found:
        raise HTTPException(status_code=400, detail="Invalid event code")
    
    event = next(e for e in eventsData if e["id"] == event_code)
    
    amount = reg_data.total_participants * 500
    
    registration_id = f"ZF26-{uuid.uuid4().hex[:8].upper()}"
    
    existing = db.query(Registration).filter(Registration.registration_id == registration_id).first()
    while existing:
        registration_id = f"ZF26-{uuid.uuid4().hex[:8].upper()}"
        existing = db.query(Registration).filter(Registration.registration_id == registration_id).first()
    
    db_registration = Registration(
        registration_id=registration_id,
        event_code=event_code,
        event_name=event["title"],
        team_name=reg_data.team_name,
        leader_name=reg_data.leader_name,
        leader_email=reg_data.leader_email,
        leader_phone=reg_data.leader_phone,
        college_name=reg_data.college_name,
        department=reg_data.department,
        total_participants=reg_data.total_participants,
        total_amount=amount,
        registration_status="PAYMENT_PENDING",
        payment_status="PAYMENT_PENDING"
    )
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    
    for participant in reg_data.participants:
        db_participant = Participant(
            registration_id=registration_id,
            name=participant.name,
            email=participant.email,
            phone=participant.phone,
            college=participant.college,
            department=participant.department,
            year=participant.year
        )
        db.add(db_participant)
    db.commit()
    
    razorpay_order = razorpay_client.order.create({
        "amount": amount * 100,
        "currency": "INR",
        "receipt": registration_id,
        "payment_capture": 1
    })
    
    razorpay_order_id = razorpay_order["id"]
    
    db_payment = Payment(
        registration_id=registration_id,
        razorpay_order_id=razorpay_order_id,
        amount=amount,
        currency="INR",
        payment_status="PENDING"
    )
    db.add(db_payment)
    db.commit()
    
    return {
        "registration_id": registration_id,
        "razorpay_order_id": razorpay_order_id,
        "amount": amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
    }
