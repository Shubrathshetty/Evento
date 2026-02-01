"""
Registration CRUD Operations - Database operations for event registrations
"""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models.registration import EventRegistration, RegistrationStatus
from ..models.event import Event


def create_registration(
    db: Session,
    user_id: UUID,
    event_id: UUID,
) -> EventRegistration:
    """
    Create a new event registration.
    
    Note: Caller should check if user is already registered
    and if event has capacity.
    """
    db_registration = EventRegistration(
        user_id=user_id,
        event_id=event_id,
        status=RegistrationStatus.CONFIRMED,
    )
    
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    return db_registration


def get_registration(
    db: Session,
    registration_id: UUID,
) -> Optional[EventRegistration]:
    """Get a registration by ID."""
    return db.query(EventRegistration).filter(
        EventRegistration.id == registration_id
    ).first()


def get_registration_by_user_event(
    db: Session,
    user_id: UUID,
    event_id: UUID,
) -> Optional[EventRegistration]:
    """Get a registration by user ID and event ID."""
    return db.query(EventRegistration).filter(
        EventRegistration.user_id == user_id,
        EventRegistration.event_id == event_id,
    ).first()


def get_user_registrations(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[EventRegistration], int]:
    """
    Get paginated list of registrations for a user.
    
    Returns:
        Tuple of (registrations list, total count)
    """
    query = db.query(EventRegistration).filter(
        EventRegistration.user_id == user_id
    )
    
    total = query.count()
    registrations = query.order_by(
        EventRegistration.registration_date.desc()
    ).offset(skip).limit(limit).all()
    
    return registrations, total


def get_event_registrations(
    db: Session,
    event_id: UUID,
    skip: int = 0,
    limit: int = 20,
    status: Optional[RegistrationStatus] = None,
) -> tuple[list[EventRegistration], int]:
    """
    Get paginated list of registrations for an event.
    
    Returns:
        Tuple of (registrations list, total count)
    """
    query = db.query(EventRegistration).filter(
        EventRegistration.event_id == event_id
    )
    
    if status:
        query = query.filter(EventRegistration.status == status)
    
    total = query.count()
    registrations = query.order_by(
        EventRegistration.registration_date.desc()
    ).offset(skip).limit(limit).all()
    
    return registrations, total


def get_all_registrations(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[EventRegistration], int]:
    """
    Get paginated list of all registrations (admin).
    
    Returns:
        Tuple of (registrations list, total count)
    """
    query = db.query(EventRegistration)
    total = query.count()
    registrations = query.order_by(
        EventRegistration.registration_date.desc()
    ).offset(skip).limit(limit).all()
    
    return registrations, total


def cancel_registration(
    db: Session,
    registration: EventRegistration,
) -> None:
    """Cancel/delete a registration."""
    db.delete(registration)
    db.commit()


def update_registration_status(
    db: Session,
    registration: EventRegistration,
    status: RegistrationStatus,
) -> EventRegistration:
    """Update registration status."""
    registration.status = status
    db.commit()
    db.refresh(registration)
    return registration


def get_registration_count_for_event(
    db: Session,
    event_id: UUID,
) -> int:
    """Get the number of confirmed registrations for an event."""
    return db.query(func.count(EventRegistration.id)).filter(
        EventRegistration.event_id == event_id,
        EventRegistration.status == RegistrationStatus.CONFIRMED,
    ).scalar() or 0
