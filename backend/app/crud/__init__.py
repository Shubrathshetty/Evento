"""
Evento Backend - CRUD Operations
"""
from .user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_users,
    update_user,
    update_user_role,
    authenticate_user,
)
from .event import (
    create_event,
    get_event,
    get_events,
    update_event,
    delete_event,
    search_events,
)
from .registration import (
    create_registration,
    get_registration,
    get_user_registrations,
    get_event_registrations,
    cancel_registration,
    update_registration_status,
)

__all__ = [
    # User CRUD
    "create_user",
    "get_user_by_email",
    "get_user_by_id",
    "get_users",
    "update_user",
    "update_user_role",
    "authenticate_user",
    # Event CRUD
    "create_event",
    "get_event",
    "get_events",
    "update_event",
    "delete_event",
    "search_events",
    # Registration CRUD
    "create_registration",
    "get_registration",
    "get_user_registrations",
    "get_event_registrations",
    "cancel_registration",
    "update_registration_status",
]
