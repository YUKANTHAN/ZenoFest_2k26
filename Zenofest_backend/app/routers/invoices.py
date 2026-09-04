from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Registration, Invoice
from app.schemas import registration
import os
from datetime import datetime

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/{registration_id}")
def get_invoice(
    registration_id: str,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.registration_id == registration_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return {
        "invoice_number": invoice.invoice_number,
        "registration_id": invoice.registration_id,
        "amount": invoice.amount,
        "created_at": invoice.created_at.isoformat() if invoice.created_at else None
    }
