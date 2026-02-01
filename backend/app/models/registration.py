"""
Event Registration Model - Database schema for event registrations/bookings
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from ..database import Base


class RegistrationStatus(str, enum.Enum):
    """Registration status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    ATTENDED = "attended"


class EventRegistration(Base):
    """Event Registration database model."""
    
    __tablename__ = "event_registrations"
    
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    event_id = Column(
        UUID(as_uuid=True),
        ForeignKey("events.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    registration_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(
        SQLEnum(RegistrationStatus, values_callable=lambda obj: [e.value for e in obj]),
        default=RegistrationStatus.CONFIRMED,
        nullable=False
    )
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Relationships
    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    
    # Ensure a user can only register once per event
    __table_args__ = (
        UniqueConstraint('user_id', 'event_id', name='unique_user_event_registration'),
    )
    
    def __repr__(self):
        return f"<EventRegistration(id={self.id}, user_id={self.user_id}, event_id={self.event_id}, status={self.status})>"
