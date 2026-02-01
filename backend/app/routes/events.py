"""
Events Routes - Event CRUD and search endpoints
"""
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Query
import math

from ..dependencies import DatabaseSession, CurrentUser, CurrentAdminUser
from ..schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventListResponse,
)
from ..crud.event import (
    create_event,
    get_event,
    get_events,
    update_event,
    delete_event,
    search_events,
)

router = APIRouter(prefix="/api/events", tags=["Events"])


@router.get(
    "",
    response_model=EventListResponse,
    summary="List all events",
)
def list_events(
    db: DatabaseSession,
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
):
    """
    Get paginated list of events.
    
    - **page**: Page number (default: 1)
    - **per_page**: Items per page (default: 20, max: 100)
    - **category**: Optional category filter
    """
    skip = (page - 1) * per_page
    events, total = get_events(db, skip=skip, limit=per_page, category=category)
    
    # Add registration_count and is_full to each event
    events_with_counts = []
    for event in events:
        event_dict = EventResponse.model_validate(event).model_dump()
        event_dict["registration_count"] = event.registration_count
        event_dict["is_full"] = event.is_full
        events_with_counts.append(EventResponse(**event_dict))
    
    return EventListResponse(
        events=events_with_counts,
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/search",
    response_model=EventListResponse,
    summary="Search events",
)
def search_events_endpoint(
    db: DatabaseSession,
    q: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Category filter"),
    location: Optional[str] = Query(None, description="Location filter"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Search events by title, description, category, or location.
    
    - **q**: Search term (searches title and description)
    - **category**: Filter by category
    - **location**: Filter by location (partial match)
    """
    skip = (page - 1) * per_page
    events, total = search_events(
        db,
        query_str=q,
        category=category,
        location=location,
        skip=skip,
        limit=per_page,
    )
    
    # Add registration counts
    events_with_counts = []
    for event in events:
        event_dict = EventResponse.model_validate(event).model_dump()
        event_dict["registration_count"] = event.registration_count
        event_dict["is_full"] = event.is_full
        events_with_counts.append(EventResponse(**event_dict))
    
    return EventListResponse(
        events=events_with_counts,
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/{event_id}",
    response_model=EventResponse,
    summary="Get event details",
)
def get_event_details(event_id: UUID, db: DatabaseSession):
    """
    Get detailed information about a specific event.
    """
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    # Build response with counts
    response = EventResponse.model_validate(event)
    response.registration_count = event.registration_count
    response.is_full = event.is_full
    return response


@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create event (admin only)",
)
def create_event_endpoint(
    event_data: EventCreate,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Create a new event. Requires admin privileges.
    """
    event = create_event(db, event_data, created_by=current_user.id)
    return event


@router.put(
    "/{event_id}",
    response_model=EventResponse,
    summary="Update event (admin only)",
)
def update_event_endpoint(
    event_id: UUID,
    event_data: EventUpdate,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Update an existing event. Requires admin privileges.
    """
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    updated_event = update_event(db, event, event_data)
    return updated_event


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete event (admin only)",
)
def delete_event_endpoint(
    event_id: UUID,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Delete an event. Requires admin privileges.
    
    This will also delete all associated registrations.
    """
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    delete_event(db, event)
    return None
