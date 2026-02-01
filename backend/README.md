# Evento Backend

FastAPI backend for the Evento event management platform.

## Features

- **JWT Authentication**: Secure signup, login, and token refresh
- **Role-Based Access Control**: User and Admin roles
- **Event Management**: Full CRUD with search and filtering
- **Registration System**: Event bookings with capacity management
- **Admin Dashboard**: Statistics and user management

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start PostgreSQL

```bash
# Using Docker from root directory
docker-compose up -d db
```

### 4. Run Migrations

```bash
alembic upgrade head
```

### 5. Start Server

```bash
uvicorn app.main:app --reload
```

Server runs at: http://localhost:8000

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (paginated) |
| GET | `/api/events/search` | Search events |
| GET | `/api/events/{id}` | Get event details |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/{id}` | Update event (admin) |
| DELETE | `/api/events/{id}` | Delete event (admin) |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/{id}/register` | Register for event |
| GET | `/api/events/{id}/registrations` | List registrations (admin) |
| GET | `/api/users/{id}/registrations` | User's registrations |
| DELETE | `/api/events/{eid}/registrations/{rid}` | Cancel registration |
| PATCH | `/api/registrations/{id}/status` | Update status (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard KPIs |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/events` | List events with analytics |
| GET | `/api/admin/registrations` | List all registrations |
| PUT | `/api/admin/users/{id}/role` | Update user role |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI entry point
│   ├── config.py         # Settings management
│   ├── database.py       # Database connection
│   ├── dependencies.py   # Dependency injection
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── routes/           # API endpoints
│   ├── crud/             # Database operations
│   └── utils/            # Helpers (security, etc.)
├── migrations/           # Alembic migrations
├── tests/                # Test suite
├── requirements.txt      # Python dependencies
├── alembic.ini           # Alembic config
└── .env.example          # Environment template
```

## Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1
```

## Testing

```bash
pytest
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://... |
| JWT_SECRET_KEY | Secret for JWT signing | (required) |
| JWT_ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token TTL | 30 |
| REFRESH_TOKEN_EXPIRE_DAYS | Refresh token TTL | 7 |
| CORS_ORIGINS | Allowed origins | ["http://localhost:5173"] |
