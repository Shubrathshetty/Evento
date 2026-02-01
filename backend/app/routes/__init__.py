"""
Evento Backend - API Routes
"""
from .auth import router as auth_router
from .events import router as events_router
from .registrations import router as registrations_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "events_router",
    "registrations_router",
    "admin_router",
]
