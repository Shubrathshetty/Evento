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


def _enrich_event_response(event) -> EventResponse:
    """Helper to enrich event with registration_count, attendees, and organizer name."""
    response = EventResponse.model_validate(event)
    response.registration_count = event.registration_count
    response.is_full = event.is_full
    response.attendees = event.registration_count  # Alias for frontend
    
    # Get organizer name from creator relationship
    if event.creator:
        response.organizer = event.creator.name
    
    return response



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
    # Public endpoint only shows published events by default
    # You might want to allow admins to see unpublished via a param, but keeping it simple for now
    events, total = get_events(
        db, 
        skip=skip, 
        limit=per_page, 
        category=category,
        only_published=True
    )
    
    # Enrich events with counts and organizer info
    events_with_data = [_enrich_event_response(event) for event in events]
    
    return EventListResponse(
        events=events_with_data,
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
    
    # Enrich events with counts and organizer info
    events_with_data = [_enrich_event_response(event) for event in events]
    
    return EventListResponse(
        events=events_with_data,
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
    
    return _enrich_event_response(event)


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


@router.patch(
    "/{event_id}/publish",
    response_model=EventResponse,
    summary="Publish/Unpublish event (admin only)",
)
def publish_event_endpoint(
    event_id: UUID,
    is_published: bool,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Toggle event publication status. Requires admin privileges.
    """
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    event_data = EventUpdate(is_published=is_published)
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
