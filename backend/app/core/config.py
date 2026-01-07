from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import os

# Resolve .env file path relative to this file
# This file is at: backend/app/core/config.py
# .env file is at: backend/.env
_env_file_path = Path(__file__).parent.parent.parent / ".env"

class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # API Configuration
    API_V1_STR: str = "/api"
    CORS_ORIGINS: str = "http://localhost:3000"

    # App Configuration
    APP_NAME: str = "Retail Boss API"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=str(_env_file_path) if _env_file_path.exists() else None,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()

# Debug output - enable to troubleshoot
if settings.DEBUG:
    print(f"DEBUG: .env file path: {_env_file_path}")
    print(f"DEBUG: .env file exists: {_env_file_path.exists()}")
    print(f"DEBUG: SUPABASE_URL = {settings.SUPABASE_URL[:30] + '...' if len(settings.SUPABASE_URL) > 30 else settings.SUPABASE_URL}")
    print(f"DEBUG: SUPABASE_ANON_KEY = {'SET' if settings.SUPABASE_ANON_KEY else 'NOT SET'}")
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        print("[WARNING] Supabase credentials not loaded from .env file!")
        print(f"   Check if .env file exists at: {_env_file_path}")