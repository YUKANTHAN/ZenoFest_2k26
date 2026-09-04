from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Registration, Participant, Invoice
from app.schemas import lookup

router = APIRouter(prefix="/lookup", tags=["lookup"])

@router.post("/")
def lookup_by_email(
    lookup_data: lookup.LookupEmail,
    db: Session = Depends(get_db)
):
    email = lookup_data.email
    
    registrations = db.query(Registration).filter(
        Registration.leader_email == email
    ).all()
    
    if not registrations:
        registrations = db.query(Registration).join(Participant).filter(
            Participant.email == email
        ).distinct().all()
    
    result = []
    for reg in registrations:
        participant_count = db.query(Participant).filter(
            Participant.registration_id == reg.registration_id
        ).count()
        
        invoice = db.query(Invoice).filter(Invoice.registration_id == reg.registration_id).first()
        invoice_available = invoice is not None
        
        result.append({
            "registration_id": reg.registration_id,
            "event_name": reg.event_name,
            "team_name": reg.team_name,
            "participant_count": participant_count,
            "payment_status": reg.payment_status,
            "invoice_available": invoice_available
        })
    
    return {
        "email": email,
        "registered_participant_count": sum(r["participant_count"] for r in result),
        "registrations": result
    }
