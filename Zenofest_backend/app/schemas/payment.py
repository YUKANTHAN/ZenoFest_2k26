from pydantic import BaseModel

class PaymentCreate(BaseModel):
    registration_id: str
    amount: int

class PaymentVerify(BaseModel):
    registration_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
