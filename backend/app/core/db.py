from supabase import create_client, Client
from app.core.config import settings


def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise ValueError("Supabase URL and ANON_KEY must be set in environment variables")

    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# Global client instance
supabase: Client = None

def init_db():
    """Initialize database connection"""
    global supabase
    try:
        # Check if credentials are set
        if not settings.SUPABASE_URL:
            raise ValueError("SUPABASE_URL is not set. Please check your .env file.")
        if not settings.SUPABASE_ANON_KEY:
            raise ValueError("SUPABASE_ANON_KEY is not set. Please check your .env file.")
        
        supabase = get_supabase_client()
        
        # Test connection by making a simple query
        try:
            # Try to query a table to verify connection
            test_response = supabase.table("products").select("id").limit(1).execute()
            print("[OK] Database connection initialized successfully")
            print(f"[OK] Supabase connection verified (URL: {settings.SUPABASE_URL[:30]}...)")
        except Exception as test_error:
            print(f"[WARNING] Connected to Supabase but table query failed: {test_error}")
            print("   This might indicate missing database tables. Run migrations if needed.")
            # Still set supabase client, as connection is valid
            print("[OK] Database connection initialized (with warnings)")
            
    except ValueError as e:
        # In development, allow running without Supabase
        supabase = None
        print(f"[ERROR] Supabase not configured. Running in mock mode.")
        print(f"   Error: {e}")
        print(f"   SUPABASE_URL: {settings.SUPABASE_URL[:50] + '...' if len(settings.SUPABASE_URL) > 50 else settings.SUPABASE_URL or 'NOT SET'}")
        print(f"   SUPABASE_ANON_KEY: {'SET (' + str(len(settings.SUPABASE_ANON_KEY)) + ' chars)' if settings.SUPABASE_ANON_KEY else 'NOT SET'}")
        print(f"   Please check your .env file in the backend/ directory")
    except Exception as e:
        supabase = None
        print(f"[ERROR] Failed to initialize database: {e}")
        print(f"   SUPABASE_URL: {settings.SUPABASE_URL[:50] + '...' if len(settings.SUPABASE_URL) > 50 else settings.SUPABASE_URL or 'NOT SET'}")
        print(f"   SUPABASE_ANON_KEY: {'SET (' + str(len(settings.SUPABASE_ANON_KEY)) + ' chars)' if settings.SUPABASE_ANON_KEY else 'NOT SET'}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
