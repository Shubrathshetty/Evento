from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class PaymentIntentCreate(BaseModel):
    event_id: UUID
    amount: int  # Amount in cents

class PaymentIntentResponse(BaseModel):
    client_secret: str
    id: str
    amount: int
    currency: str = "usd"
