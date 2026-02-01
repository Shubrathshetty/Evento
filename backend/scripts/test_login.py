import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.crud.user import authenticate_user

def test_auth():
    db = SessionLocal()
    try:
        user = authenticate_user(db, "admin@evento.com", "admin123")
        if user:
            print("✅ Authentication SUCCESS")
            print(f"User ID: {user.id}")
            print(f"Role: {user.role}")
        else:
            print("❌ Authentication FAILED")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_auth()
