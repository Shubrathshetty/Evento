"""
Event Model - Database schema for events
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..database import Base


class Event(Base):
    """Event database model."""
    
    __tablename__ = "events"
    
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False, index=True)
    location = Column(String(255), nullable=True)
    map_link = Column(String(500), nullable=True)  # Google Maps link
    category = Column(String(100), nullable=True, index=True)
    capacity = Column(Integer, nullable=True)
    image_url = Column(String(500), nullable=True)
    time = Column(String(50), nullable=True)  # Time of event (e.g., "7:00 PM")
    price = Column(Integer, nullable=True)  # Price in dollars/cents
    
    # New Admin Features
    registration_deadline = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    
    # Foreign key to creator (User)
    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Relationships
    creator = relationship("User", back_populates="events")
    registrations = relationship(
        "EventRegistration",
        back_populates="event",
        lazy="dynamic",
        cascade="all, delete-orphan"
    )
    
    @property
    def registration_count(self) -> int:
        """Get the number of registrations for this event."""
        return self.registrations.count()
    
    @property
    def is_full(self) -> bool:
        """Check if the event has reached capacity."""
        if self.capacity is None:
            return False
        return self.registration_count >= self.capacity
    
    def __repr__(self):
        return f"<Event(id={self.id}, title={self.title})>"
