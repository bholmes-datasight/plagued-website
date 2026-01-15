"""
Supabase Client Configuration
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

def get_supabase_client() -> Client:
    """
    Get Supabase client with service role key.
    Service role bypasses RLS for backend operations.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("Supabase credentials not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")

    # Ensure URL has trailing slash for storage operations
    url = SUPABASE_URL if SUPABASE_URL.endswith('/') else SUPABASE_URL + '/'
    return create_client(url, SUPABASE_SERVICE_ROLE_KEY)

# Singleton instance
supabase: Client = get_supabase_client()
