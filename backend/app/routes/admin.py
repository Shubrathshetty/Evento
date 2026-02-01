"""
Admin Routes - Admin-only endpoints for dashboard, users, and settings
"""
from uuid import UUID
from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
import math

from ..dependencies import DatabaseSession, CurrentAdminUser
from ..database import get_db
from ..models.user import User
from ..models.event import Event
from ..models.registration import EventRegistration
from ..schemas.user import UserResponse, UserListResponse, UserRoleUpdate
from ..schemas.event import EventResponse, EventListResponse
from ..schemas.registration import RegistrationListResponse, RegistrationWithDetailsResponse
from ..crud.user import get_users, get_user_by_id, update_user_role
from ..crud.event import get_events
from ..crud.registration import get_all_registrations

router = APIRouter(prefix="/api/admin", tags=["Admin"])


class DashboardStats:
    """Dashboard statistics response."""
    pass


@router.get(
    "/dashboard/stats",
    summary="Get dashboard statistics",
)
def get_dashboard_stats(
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Get dashboard KPI statistics. Requires admin privileges.
    
    Returns:
    - Total users count
    - Total events count
    - Total registrations count
    - Users this month
    - Events this month
    - Registrations this month
    """
    # Get total counts
    total_users = db.query(func.count(User.id)).scalar()
    total_events = db.query(func.count(Event.id)).scalar()
    total_registrations = db.query(func.count(EventRegistration.id)).scalar()
    
    # Get counts by status (for registrations)
    from ..models.registration import RegistrationStatus
    confirmed_registrations = db.query(func.count(EventRegistration.id)).filter(
        EventRegistration.status == RegistrationStatus.CONFIRMED
    ).scalar()
    
    pending_registrations = db.query(func.count(EventRegistration.id)).filter(
        EventRegistration.status == RegistrationStatus.PENDING
    ).scalar()
    
    cancelled_registrations = db.query(func.count(EventRegistration.id)).filter(
        EventRegistration.status == RegistrationStatus.CANCELLED
    ).scalar()
    
    return {
        "total_users": total_users or 0,
        "total_events": total_events or 0,
        "total_registrations": total_registrations or 0,
        "confirmed_registrations": confirmed_registrations or 0,
        "pending_registrations": pending_registrations or 0,
        "cancelled_registrations": cancelled_registrations or 0,
    }


@router.get(
    "/users",
    response_model=UserListResponse,
    summary="List all users",
)
def list_all_users(
    db: DatabaseSession,
    current_user: CurrentAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get paginated list of all users. Requires admin privileges.
    """
    skip = (page - 1) * per_page
    users, total = get_users(db, skip=skip, limit=per_page)
    
    return UserListResponse(
        users=[UserResponse.model_validate(u) for u in users],
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/events",
    response_model=EventListResponse,
    summary="List all events with analytics",
)
def list_all_events(
    db: DatabaseSession,
    current_user: CurrentAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get paginated list of all events with analytics. Requires admin privileges.
    """
    skip = (page - 1) * per_page
    events, total = get_events(db, skip=skip, limit=per_page)
    
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
    "/registrations",
    response_model=RegistrationListResponse,
    summary="List all registrations",
)
def list_all_registrations(
    db: DatabaseSession,
    current_user: CurrentAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    """
    Get paginated list of all registrations. Requires admin privileges.
    """
    skip = (page - 1) * per_page
    registrations, total = get_all_registrations(db, skip=skip, limit=per_page)
    
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


@router.put(
    "/users/{user_id}/role",
    response_model=UserResponse,
    summary="Update user role",
)
def update_user_role_endpoint(
    user_id: UUID,
    role_update: UserRoleUpdate,
    db: DatabaseSession,
    current_user: CurrentAdminUser,
):
    """
    Update a user's role. Requires admin privileges.
    
    Roles: user, admin
    """
    # Prevent self-demotion
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role",
        )
    
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    updated_user = update_user_role(db, user, role_update.role)
    return updated_user


@router.put(
    "/settings",
    summary="Update platform settings (placeholder)",
)
def update_settings(
    current_user: CurrentAdminUser,
):
    """
    Update platform settings. Requires admin privileges.
    
    This is a placeholder endpoint for future settings management.
    """
    return {
        "message": "Settings endpoint placeholder",
        "settings": {},
    }
