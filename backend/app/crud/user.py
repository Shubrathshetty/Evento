"""
User CRUD Operations - Database operations for users
"""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models.user import User, UserRole
from ..schemas.user import UserCreate, UserUpdate
from ..utils.security import get_password_hash, verify_password


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user."""
    password_hash = get_password_hash(user_data.password)
    
    db_user = User(
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name,
        role="user",
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email address."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_users(
    db: Session,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[User], int]:
    """
    Get paginated list of users.
    
    Returns:
        Tuple of (users list, total count)
    """
    total = db.query(func.count(User.id)).scalar()
    users = db.query(User).offset(skip).limit(limit).all()
    return users, total


def update_user(
    db: Session,
    user: User,
    user_data: UserUpdate,
) -> User:
    """Update user profile."""
    update_data = user_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user


def update_user_role(
    db: Session,
    user: User,
    role: UserRole,
) -> User:
    """Update user role (admin only)."""
    user.role = role
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> Optional[User]:
    """
    Authenticate a user by email and password.
    
    Returns:
        User if credentials are valid, None otherwise
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
