"""
Registration Schemas - Request/Response models for event registration endpoints
"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from ..models.registration import RegistrationStatus
from .user import UserResponse
from .event import EventResponse


class RegistrationCreate(BaseModel):
    """Schema for creating a registration (user registers for event)."""
    # No fields needed - user_id comes from auth, event_id from URL
    pass


class RegistrationUpdate(BaseModel):
    """Schema for updating registration status."""
    status: RegistrationStatus


class RegistrationResponse(BaseModel):
    """Schema for registration response."""
    id: UUID
    user_id: UUID
    event_id: UUID
    registration_date: datetime
    status: RegistrationStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RegistrationWithEventResponse(RegistrationResponse):
    """Schema for registration response with event details."""
    event: Optional[EventResponse] = None


class RegistrationWithUserResponse(RegistrationResponse):
    """Schema for registration response with user details."""
    user: Optional[UserResponse] = None


class RegistrationWithDetailsResponse(RegistrationResponse):
    """Schema for registration response with both user and event details."""
    user: Optional[UserResponse] = None
    event: Optional[EventResponse] = None


class RegistrationListResponse(BaseModel):
    """Schema for paginated registration list."""
    registrations: list[RegistrationWithDetailsResponse]
    total: int
    page: int
    per_page: int
    pages: int
