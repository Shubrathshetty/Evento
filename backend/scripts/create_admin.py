"""
Create Admin Script
Run this script to create a new administrator account.
Usage: python scripts/create_admin.py <email> <password> <name>
"""
import sys
import argparse
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.utils.security import get_password_hash

def create_admin(email, password, name):
    db = SessionLocal()
    try:
        # Check if exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"⚠️ User with email {email} already exists! Resetting password...")
            existing.password_hash = get_password_hash(password)
            existing.role = "admin" # Ensure role is admin
            db.commit()
            print(f"✅ Admin password updated successfully!")
            return

        admin = User(
            email=email,
            name=name,
            password_hash=get_password_hash(password),
            role="admin"  # Explicitly set admin role
        )
        db.add(admin)
        db.commit()
        print(f"✅ Admin created successfully!")
        print(f"   Email: {email}")
        print(f"   Role:  ADMIN")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an Admin user")
    parser.add_argument("email", help="Admin email address")
    parser.add_argument("password", help="Admin password")
    parser.add_argument("name", help="Admin name")
    
    args = parser.parse_args()
    create_admin(args.email, args.password, args.name)
