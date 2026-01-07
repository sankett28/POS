#!/usr/bin/env python3
"""
Diagnostic script to check Supabase configuration
Run this to verify your .env file and Supabase connection
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

print("=" * 60)
print("Supabase Configuration Diagnostic")
print("=" * 60)

# Check .env file
env_path = Path(__file__).parent / ".env"
print(f"\n1. Checking .env file...")
print(f"   Path: {env_path}")
print(f"   Exists: {env_path.exists()}")

if env_path.exists():
    print(f"   ✓ .env file found")
    # Read and check contents (without exposing secrets)
    with open(env_path, 'r') as f:
        lines = f.readlines()
        has_url = any('SUPABASE_URL' in line for line in lines)
        has_anon_key = any('SUPABASE_ANON_KEY' in line for line in lines)
        has_service_key = any('SUPABASE_SERVICE_ROLE_KEY' in line for line in lines)
        
        print(f"   SUPABASE_URL defined: {has_url}")
        print(f"   SUPABASE_ANON_KEY defined: {has_anon_key}")
        print(f"   SUPABASE_SERVICE_ROLE_KEY defined: {has_service_key}")
else:
    print(f"   ✗ .env file NOT FOUND")
    print(f"   Please create .env file in backend/ directory")

# Check environment variables loading
print(f"\n2. Checking environment variable loading...")
try:
    from app.core.config import settings
    
    print(f"   SUPABASE_URL loaded: {'YES' if settings.SUPABASE_URL else 'NO'}")
    if settings.SUPABASE_URL:
        print(f"   SUPABASE_URL value: {settings.SUPABASE_URL[:50]}...")
    else:
        print(f"   SUPABASE_URL value: (empty)")
    
    print(f"   SUPABASE_ANON_KEY loaded: {'YES' if settings.SUPABASE_ANON_KEY else 'NO'}")
    if settings.SUPABASE_ANON_KEY:
        print(f"   SUPABASE_ANON_KEY length: {len(settings.SUPABASE_ANON_KEY)} characters")
    else:
        print(f"   SUPABASE_ANON_KEY value: (empty)")
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        print(f"   ✗ Configuration incomplete!")
    else:
        print(f"   ✓ Configuration loaded successfully")
        
except Exception as e:
    print(f"   ✗ Error loading configuration: {e}")
    import traceback
    traceback.print_exc()

# Check Supabase connection
print(f"\n3. Testing Supabase connection...")
try:
    from app.core.db import get_supabase_client, settings
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        print(f"   ✗ Cannot test connection - credentials missing")
    else:
        client = get_supabase_client()
        print(f"   ✓ Supabase client created")
        
        # Test connection with a simple query
        try:
            response = client.table("products").select("id").limit(1).execute()
            print(f"   ✓ Connection successful - can query database")
            print(f"   ✓ Products table exists and accessible")
        except Exception as query_error:
            error_msg = str(query_error)
            if "relation" in error_msg.lower() or "does not exist" in error_msg.lower():
                print(f"   ⚠ Connection works but tables might not exist")
                print(f"   Error: {error_msg[:100]}")
                print(f"   → Run database migrations from backend/app/migrations/")
            else:
                print(f"   ✗ Connection failed: {error_msg[:100]}")
                
except ValueError as e:
    print(f"   ✗ Configuration error: {e}")
except Exception as e:
    print(f"   ✗ Connection error: {e}")
    import traceback
    traceback.print_exc()

print(f"\n" + "=" * 60)
print("Diagnostic complete!")
print("=" * 60)

