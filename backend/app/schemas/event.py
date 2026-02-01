"""
Event Schemas - Request/Response models for event-related endpoints
"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

from .user import UserResponse


class EventCreate(BaseModel):
    """Schema for creating an event."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    date: datetime
    location: Optional[str] = Field(None, max_length=255)
    map_link: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    capacity: Optional[int] = Field(None, ge=1)
    image_url: Optional[str] = Field(None, max_length=500)
    time: Optional[str] = Field(None, max_length=50)
    price: Optional[int] = Field(None, ge=0)
    registration_deadline: Optional[datetime] = None
    is_published: bool = False


class EventUpdate(BaseModel):
    """Schema for updating an event."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    map_link: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    capacity: Optional[int] = Field(None, ge=1)
    image_url: Optional[str] = Field(None, max_length=500)
    time: Optional[str] = Field(None, max_length=50)
    price: Optional[int] = Field(None, ge=0)
    registration_deadline: Optional[datetime] = None
    is_published: Optional[bool] = None


class EventResponse(BaseModel):
    """Schema for event response."""
    id: UUID
    title: str
    description: Optional[str]
    date: datetime
    location: Optional[str]
    map_link: Optional[str]
    category: Optional[str]
    capacity: Optional[int]
    image_url: Optional[str]
    time: Optional[str]
    price: Optional[int]
    registration_deadline: Optional[datetime]
    is_published: bool
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    registration_count: int = 0
    is_full: bool = False
    attendees: int = 0  # Alias for registration_count for frontend compatibility
    organizer: Optional[str] = None  # Creator's name

    class Config:
        from_attributes = True


class EventWithCreatorResponse(EventResponse):
    """Schema for event response with creator details."""
    creator: Optional[UserResponse] = None


class EventListResponse(BaseModel):
    """Schema for paginated event list."""
    events: list[EventResponse]
    total: int
    page: int
    per_page: int
    pages: int


class EventSearchParams(BaseModel):
    """Schema for event search parameters."""
    query: Optional[str] = None
    category: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
