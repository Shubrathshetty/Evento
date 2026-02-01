import sys
from pathlib import Path
from uuid import uuid4
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.crud.user import get_user_by_email
from app.crud.registration import get_user_registrations
from app.schemas.registration import RegistrationWithEventResponse

def test_get_regs():
    db = SessionLocal()
    try:
        user = get_user_by_email(db, "admin@evento.com")
        if not user:
            print("❌ User not found")
            return

        print(f"Fetching registrations for user: {user.id}")
        regs, total = get_user_registrations(db, user.id)
        print(f"Found {total} registrations.")
        
        for r in regs:
            print(f" - Event: {r.event_id}, Status: {r.status} (Type: {type(r.status)})")
            # Validation test
            try:
                schema = RegistrationWithEventResponse.model_validate(r)
                print("   ✅ Pydantic Serialize OK")
            except Exception as e:
                print(f"   ❌ Pydantic Serialize FAILED: {e}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_get_regs()
