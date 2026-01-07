from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # API Configuration
    API_V1_STR: str = "/api"
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # App Configuration
    APP_NAME: str = "Retail Boss API"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
