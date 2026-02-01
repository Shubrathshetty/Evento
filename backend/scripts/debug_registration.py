import sys
from pathlib import Path
from uuid import uuid4
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.crud.user import get_user_by_email
from app.crud.event import get_events, create_event
from app.schemas.event import EventCreate
from app.crud.registration import create_registration, get_registration_by_user_event
from datetime import datetime

def debug_reg():
    db = SessionLocal()
    try:
        # 1. Get User
        user = get_user_by_email(db, "admin@evento.com")
        if not user:
            print("❌ User not found")
            return

        # 2. Get or Create Event
        events, _ = get_events(db, limit=1)
        if not events:
            print("⚠️ No events found. Creating one...")
            event = create_event(db, EventCreate(
                title="Debug Event",
                date=datetime.utcnow(),
                limit=10,
                description="Test"
            ), user.id)
        else:
            event = events[0]
        
        print(f"User: {user.id}")
        print(f"Event: {event.id}")

        # 3. Check existing
        existing = get_registration_by_user_event(db, user.id, event.id)
        if existing:
            print("⚠️ User already registered. Deleting existing...")
            db.delete(existing)
            db.commit()

        # 4. Try Register
        print("Attempting registration...")
        reg = create_registration(db, user.id, event.id)
        print("✅ Registration created in DB!")
        print(f"ID: {reg.id}")
        print(f"Status: {reg.status}")

        # 5. Try Pydantic Validation (Simulate Route response)
        from app.schemas.registration import RegistrationResponse
        print("Validating with Pydantic...")
        schema = RegistrationResponse.model_validate(reg)
        print("✅ Pydantic Validation Success!")
        print(schema.json())

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_reg()
