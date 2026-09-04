from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import Registration, Payment, Invoice, Participant
from app.schemas import payment
import razorpay
import uuid
import os
from datetime import datetime

router = APIRouter(prefix="/payments", tags=["payments"])

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@router.post("/create-order")
def create_order(
    reg_id: str,
    db: Session = Depends(get_db)
):
    payment_record = db.query(Payment).filter(Payment.registration_id == reg_id).first()
    if not payment_record:
        raise HTTPException(status_code=404, detail="Registration not found")

    razorpay_order = razorpay_client.order.create({
        "amount": payment_record.amount * 100,
        "currency": "INR",
        "receipt": reg_id,
        "payment_capture": 1
    })

    payment_record.razorpay_order_id = razorpay_order["id"]
    db.commit()

    return {
        "order_id": razorpay_order["id"],
        "amount": payment_record.amount,
        "currency": "INR"
    }


@router.post("/verify")
def verify_payment(
    verify_data: payment.PaymentVerify,
    db: Session = Depends(get_db)
):
    pay_rec = db.query(Payment).filter(Payment.registration_id == verify_data.registration_id).first()
    if not pay_rec:
        raise HTTPException(status_code=404, detail="Payment record not found")

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    params_dict = {
        'razorpay_order_id': verify_data.razorpay_order_id,
        'razorpay_payment_id': verify_data.razorpay_payment_id,
        'razorpay_signature': verify_data.razorpay_signature
    }

    try:
        client.utility.verify_payment_signature(params_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")

    pay_rec.razorpay_payment_id = verify_data.razorpay_payment_id
    pay_rec.payment_status = "PAID"
    pay_rec.paid_at = datetime.utcnow()

    registration = db.query(Registration).filter(Registration.registration_id == verify_data.registration_id).first()
    if registration:
        registration.payment_status = "PAID"
        registration.registration_status = "PAYMENT_VERIFIED"

    existing_invoice = db.query(Invoice).filter(Invoice.registration_id == verify_data.registration_id).first()
    if not existing_invoice:
        invoice_number = f"ZFI-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        new_invoice = Invoice(
            invoice_number=invoice_number,
            registration_id=verify_data.registration_id,
            razorpay_payment_id=verify_data.razorpay_payment_id,
            amount=pay_rec.amount,
        )
        db.add(new_invoice)
        db.commit()

        if registration:
            try:
                from app.services.invoice_service import InvoiceService
                pdf_path = InvoiceService.generate_invoice_pdf(registration, pay_rec)
                new_invoice.pdf_path = pdf_path
                db.commit()
            except Exception as e:
                print(f"PDF generation error: {e}")

    db.commit()

    if registration:
        try:
            from app.services.email_service import EmailService
            email_service = EmailService(settings)
            email_service.send_registration_confirmation(registration, pay_rec)
        except Exception as e:
            print(f"Email send error: {e}")

        try:
            from app.services.google_sheets import GoogleSheetsService
            participants = db.query(Participant).filter(Participant.registration_id == registration.registration_id).all()
            participants_names = ", ".join([p.name for p in participants])
            sheets = GoogleSheetsService()
            sheets.append_registration(registration, participants_names)
        except Exception as e:
            print(f"Google Sheets error: {e}")

    return {
        "status": "success",
        "message": "Payment verified successfully",
        "registration_id": verify_data.registration_id
    }


@router.get("/invoice-pdf/{registration_id}")
def download_invoice_pdf(
    registration_id: str,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.registration_id == registration_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if invoice.pdf_path and os.path.exists(invoice.pdf_path):
        return FileResponse(
            invoice.pdf_path,
            media_type="application/pdf",
            filename=f"{registration_id}_invoice.pdf"
        )

    registration = db.query(Registration).filter(Registration.registration_id == registration_id).first()
    pay_rec = db.query(Payment).filter(Payment.registration_id == registration_id).first()
    if not registration or not pay_rec:
        raise HTTPException(status_code=404, detail="Registration or payment not found")

    try:
        from app.services.invoice_service import InvoiceService
        pdf_path = InvoiceService.generate_invoice_pdf(registration, pay_rec)
        invoice.pdf_path = pdf_path
        db.commit()
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{registration_id}_invoice.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")


@router.post("/webhook")
async def webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")

    if not signature:
        raise HTTPException(status_code=400, detail="Missing webhook signature")

    return {"status": "processed"}
