"""
Event CRUD Operations - Database operations for events
"""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from ..models.event import Event
from ..schemas.event import EventCreate, EventUpdate


def create_event(
    db: Session,
    event_data: EventCreate,
    created_by: UUID,
) -> Event:
    """Create a new event."""
    db_event = Event(
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        location=event_data.location,
        category=event_data.category,
        capacity=event_data.capacity,
        image_url=event_data.image_url,
        created_by=created_by,
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_event(db: Session, event_id: UUID) -> Optional[Event]:
    """Get an event by ID."""
    return db.query(Event).filter(Event.id == event_id).first()


def get_events(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
) -> tuple[list[Event], int]:
    """
    Get paginated list of events.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        category: Optional category filter
        
    Returns:
        Tuple of (events list, total count)
    """
    query = db.query(Event)
    
    if category:
        query = query.filter(Event.category == category)
    
    # Order by date descending (upcoming events first)
    query = query.order_by(Event.date.desc())
    
    total = query.count()
    events = query.offset(skip).limit(limit).all()
    
    return events, total


def search_events(
    db: Session,
    query_str: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Event], int]:
    """
    Search events with various filters.
    
    Args:
        db: Database session
        query_str: Search term for title/description
        category: Category filter
        location: Location filter
        skip: Pagination offset
        limit: Maximum results
        
    Returns:
        Tuple of (events list, total count)
    """
    query = db.query(Event)
    
    if query_str:
        search_pattern = f"%{query_str}%"
        query = query.filter(
            or_(
                Event.title.ilike(search_pattern),
                Event.description.ilike(search_pattern),
            )
        )
    
    if category:
        query = query.filter(Event.category == category)
    
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    
    # Order by date
    query = query.order_by(Event.date.desc())
    
    total = query.count()
    events = query.offset(skip).limit(limit).all()
    
    return events, total


def update_event(
    db: Session,
    event: Event,
    event_data: EventUpdate,
) -> Event:
    """Update an event."""
    update_data = event_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event: Event) -> None:
    """Delete an event."""
    db.delete(event)
    db.commit()
