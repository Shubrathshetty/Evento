"""
Create Public User Script
Run this script to create a new regular user account.
Usage: python scripts/create_user.py <email> <password> <name>
"""
import sys
import argparse
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash

def create_user(email, password, name):
    db = SessionLocal()
    try:
        # Check if exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"❌ User with email {email} already exists!")
            return

        user = User(
            email=email,
            name=name,
            password_hash=get_password_hash(password),
            role="user"  # Default user role
        )
        db.add(user)
        db.commit()
        print(f"✅ User created successfully!")
        print(f"   Email: {email}")
        print(f"   Role:  PUBLIC USER")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a Public user")
    parser.add_argument("email", help="User email address")
    parser.add_argument("password", help="User password")
    parser.add_argument("name", help="User name")
    
    args = parser.parse_args()
    create_user(args.email, args.password, args.name)
