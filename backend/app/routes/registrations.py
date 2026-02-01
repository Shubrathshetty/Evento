"""
Registrations Routes - Event registration/booking endpoints
"""
from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Query
import math

from ..dependencies import DatabaseSession, CurrentUser, CurrentAdminUser
from ..schemas.registration import (
    RegistrationResponse,
    RegistrationUpdate,
    RegistrationWithEventResponse,
    RegistrationListResponse,
    RegistrationWithDetailsResponse,
)
from ..crud.event import get_event
from ..crud.registration import (
    create_registration,
    get_registration,
    get_registration_by_user_event,
    get_user_registrations,
    get_event_registrations,
    cancel_registration,
    update_registration_status,
)

router = APIRouter(tags=["Registrations"])


@router.post(
    "/api/events/{event_id}/register",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register for an event",
)
def register_for_event(
    event_id: UUID,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    """
    Register the current user for an event.
    
    Will fail if:
    - Event doesn't exist
    - User is already registered
    - Event is at full capacity
    """
    # Check event exists
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    # Check not already registered
    existing = get_registration_by_user_event(db, current_user.id, event_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already registered for this event",
        )
    
    # Check capacity
    if event.is_full:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is at full capacity",
        )
    
    registration = create_registration(db, current_user.id, event_id)
    return registration


@router.get(
    "/api/events/{event_id}/registrations",
    response_model=RegistrationListResponse,
    summary="List event registrations (admin only)",
)
def list_event_registrations(
    event_id: UUID,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get all registrations for a specific event. Requires admin privileges.
    """
    # Check event exists
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    
    skip = (page - 1) * per_page
    registrations, total = get_event_registrations(
        db, event_id, skip=skip, limit=per_page
    )
    
    # Convert to response with details
    reg_responses = [
        RegistrationWithDetailsResponse.model_validate(r) 
        for r in registrations
    ]
    
    return RegistrationListResponse(
        registrations=reg_responses,
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/api/users/me/registrations",
    response_model=RegistrationListResponse,
    summary="Get current user's registrations",
)
def get_my_registrations(
    db: DatabaseSession,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get all event registrations for the current authenticated user.
    """
    skip = (page - 1) * per_page
    registrations, total = get_user_registrations(
        db, current_user.id, skip=skip, limit=per_page
    )
    
    reg_responses = [
        RegistrationWithEventResponse.model_validate(r) 
        for r in registrations
    ]
    
    return RegistrationListResponse(
        registrations=reg_responses,
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/api/users/{user_id}/registrations",
    response_model=list[RegistrationWithEventResponse],
    summary="Get user's registrations",
)
def get_user_event_registrations(
    user_id: UUID,
    db: DatabaseSession,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get all event registrations for a user.
    
    Users can only view their own registrations unless they are admin.
    """
    # Check authorization
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users' registrations",
        )
    
    skip = (page - 1) * per_page
    registrations, total = get_user_registrations(
        db, user_id, skip=skip, limit=per_page
    )
    
    return [
        RegistrationWithEventResponse.model_validate(r) 
        for r in registrations
    ]


@router.delete(
    "/api/events/{event_id}/registrations/{registration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel registration",
)
def cancel_event_registration(
    event_id: UUID,
    registration_id: UUID,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    """
    Cancel an event registration.
    
    Users can cancel their own registrations. Admins can cancel any registration.
    """
    registration = get_registration(db, registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found",
        )
    
    # Verify it's for the correct event
    if registration.event_id != event_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration does not belong to this event",
        )
    
    # Check authorization
    is_owner = registration.user_id == current_user.id
    is_admin = current_user.role == "admin"
    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot cancel other users' registrations",
        )
    
    cancel_registration(db, registration)
    return None


@router.patch(
    "/api/registrations/{registration_id}/status",
    response_model=RegistrationResponse,
    summary="Update registration status (admin only)",
)
def update_status(
    registration_id: UUID,
    status_update: RegistrationUpdate,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Update the status of a registration. Requires admin privileges.
    
    Status can be: pending, confirmed, cancelled, attended
    """
    registration = get_registration(db, registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found",
        )
    
    updated = update_registration_status(db, registration, status_update.status)
    return updated


@router.delete(
    "/api/registrations/{registration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel registration by ID",
)
def delete_registration(
    registration_id: UUID,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    """
    Delete/cancel a registration by its ID.
    
    Users can cancel their own registrations. Admins can cancel any registration.
    """
    registration = get_registration(db, registration_id)
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found",
        )
    
    # Check authorization
    is_owner = registration.user_id == current_user.id
    is_admin = current_user.role == "admin"
    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot cancel other users' registrations",
        )
    
    cancel_registration(db, registration)
    return None
