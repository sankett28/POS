from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError("Supabase URL and KEY must be set in environment variables")
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Global client instance
supabase: Client = None

def init_db():
    """Initialize database connection"""
    global supabase
    try:
        supabase = get_supabase_client()
    except ValueError:
        # In development, allow running without Supabase
        supabase = None
        print("Warning: Supabase not configured. Running in mock mode.")
