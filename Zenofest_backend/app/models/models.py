from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(String, unique=True, index=True, nullable=False)
    event_code = Column(String, nullable=False)
    event_name = Column(String, nullable=False)
    team_name = Column(String, nullable=False)
    leader_name = Column(String, nullable=False)
    leader_email = Column(String, nullable=False)
    leader_phone = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    department = Column(String, nullable=True)
    registration_status = Column(String, default="PAYMENT_PENDING")
    payment_status = Column(String, default="PAYMENT_PENDING")
    total_participants = Column(Integer, nullable=False)
    total_amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    college = Column(String, nullable=True)
    department = Column(String, nullable=True)
    year = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(String, nullable=False)
    razorpay_order_id = Column(String, nullable=False, unique=True)
    razorpay_payment_id = Column(String, nullable=True, unique=True)
    razorpay_signature = Column(String, nullable=True)
    amount = Column(Integer, nullable=False)
    currency = Column(String, default="INR")
    payment_status = Column(String, default="PENDING")
    payment_method = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="NEW")
    created_at = Column(DateTime, default=datetime.utcnow)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    registration_id = Column(String, nullable=False, unique=True)
    razorpay_payment_id = Column(String, nullable=True)
    amount = Column(Integer, nullable=False)
    pdf_path = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)