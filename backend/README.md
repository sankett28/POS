# Retail Boss Backend - FastAPI

This is the Python FastAPI backend for the Retail Boss application.

## Setup

1. Navigate to the `backend` directory:
   `cd backend`

2. Install dependencies:
   `pip install -r requirements.txt`

3. Create a `.env` file based on `.env.example` and fill in your Supabase credentials:
   `cp .env.example .env`

4. Run database migrations on Supabase using the SQL files in `app/migrations/`.

5. Start the backend server:
   `uvicorn app.main:app --reload --port 8000`

## API Endpoints

- `/api/dashboard`
- `/api/inventory`
- `/api/billing`
- `/api/sales`
- `/api/products`
- `/api/analytics`
- `/api/voice`
- `/api/notifications`


