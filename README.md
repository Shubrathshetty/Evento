# Evento - Full Stack Monorepo

## Project Structure

```
evento/
├── frontend/          # React/Vite frontend
├── backend/           # FastAPI Python backend
└── docker-compose.yml # Docker orchestration
```

## Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Docker & Docker Compose (for PostgreSQL)

### 1. Start PostgreSQL Database

```bash
docker-compose up -d db
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

Backend will be available at: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Docker Compose

Run the full stack with Docker:

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Reset database
docker-compose down -v
```

## Environment Variables

See `.env.example` files in root and backend directories.

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (migrations)
- JWT Authentication
- Pydantic

## License

MIT
