"""
Seed Data Script - Populate database with sample events
Run this script to add sample events to the database
"""
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User
from app.models.event import Event
from app.utils.security import get_password_hash


def create_admin_user(db: Session) -> User:
    """Create an admin user if doesn't exist."""
    admin = db.query(User).filter(User.email == "admin@evento.com").first()
    
    if not admin:
        admin = User(
            email="admin@evento.com",
            name="Event Administrator",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"✓ Created admin user: {admin.email}")
    else:
        print(f"✓ Admin user already exists: {admin.email}")
    
    return admin


def create_sample_events(db: Session, admin_id) -> None:
    """Create sample events."""
    
    # Check if events already exist
    existing_count = db.query(Event).count()
    if existing_count > 0:
        print(f"✓ Database already has {existing_count} events. Skipping seed.")
        return
    
    now = datetime.now()
    
    sample_events = [
        {
            "title": "Tech Innovation Summit 2026",
            "description": "Join industry leaders and innovators for a day of inspiring talks about the future of technology. Network with professionals and explore cutting-edge solutions.",
            "date": now + timedelta(days=15),
            "time": "9:00 AM",
            "location": "Silicon Valley Convention Center",
            "category": "Technology",
            "capacity": 500,
            "price": 199,
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
        },
        {
            "title": "Jazz Night Under the Stars",
            "description": "Experience smooth jazz in an outdoor setting with world-class musicians. Bring your blankets and enjoy a magical evening of live music.",
            "date": now + timedelta(days=7),
            "time": "7:00 PM",
            "location": "Central Park Amphitheater",
            "category": "Music",
            "capacity": 300,
            "price": 45,
            "image_url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop"
        },
        {
            "title": "Startup Pitch Competition",
            "description": "Watch ambitious entrepreneurs pitch their innovative ideas to top investors. Great networking opportunity for founders and investors alike.",
            "date": now + timedelta(days=21),
            "time": "2:00 PM",
            "location": "Innovation Hub Downtown",
            "category": "Business",
            "capacity": 200,
            "price": 50,
            "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop"
        },
        {
            "title": "Gourmet Food Festival",
            "description": "Taste dishes from 50+ local restaurants and food trucks. Cooking demonstrations, wine tasting, and live entertainment throughout the day.",
            "date": now + timedelta(days=30),
            "time": "11:00 AM",
            "location": "Riverside Park",
            "category": "Food",
            "capacity": 1000,
            "price": 0,  # Free event
            "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
        },
        {
            "title": "Modern Art Exhibition Opening",
            "description": "Celebrate the opening of our new contemporary art exhibition featuring local and international artists. Includes artist meet-and-greet.",
            "date": now + timedelta(days=10),
            "time": "6:00 PM",
            "location": "City Art Gallery",
            "category": "Art",
            "capacity": 150,
            "price": 25,
            "image_url": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop"
        },
        {
            "title": "Marathon Training Workshop",
            "description": "Free workshop for marathon runners of all levels. Learn proper form, nutrition, and training schedules from professional coaches.",
            "date": now + timedelta(days=5),
            "time": "8:00 AM",
            "location": "Community Sports Center",
            "category": "Sports",
            "capacity": 100,
            "price": 0,
            "image_url": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop"
        },
        {
            "title": "Python Web Development Bootcamp",
            "description": "Intensive 2-day workshop covering FastAPI, React, and deployment. Build a complete web application from scratch. All skill levels welcome.",
            "date": now + timedelta(days=14),
            "time": "9:00 AM",
            "location": "Tech Learning Center",
            "category": "Education",
            "capacity": 50,
            "price": 299,
            "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop"
        },
        {
            "title": "Charity 5K Run for Education",
            "description": "Run or walk to support local schools! All proceeds go to buying books and supplies for underprivileged students. T-shirt included.",
            "date": now + timedelta(days=20),
            "time": "7:00 AM",
            "location": "Memorial Park",
            "category": "Charity",
            "capacity": 500,
            "price": 30,
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
        },
    ]
    
    for event_data in sample_events:
        event = Event(
            **event_data,
            created_by=admin_id
        )
        db.add(event)
    
    db.commit()
    print(f"✓ Created {len(sample_events)} sample events")


def main():
    """Main seeding function."""
    print("🌱 Starting database seed...")
    print("-" * 50)
    
    db = SessionLocal()
    try:
        # Create admin user
        admin = create_admin_user(db)
        
        # Create sample events
        create_sample_events(db, admin.id)
        
        print("-" * 50)
        print("✅ Database seeding completed successfully!")
        print("\nYou can now:")
        print("  - Login as admin: admin@evento.com / admin123")
        print("  - View events at: http://localhost:8000/api/events")
        print("  - Access API docs: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
