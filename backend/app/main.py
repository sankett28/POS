from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables BEFORE importing anything that uses them
# This ensures env vars are available when config.py is imported
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=str(env_path))
    print(f"[OK] Loaded .env file from: {env_path}")
else:
    print(f"[WARNING] .env file not found at: {env_path}")
    print("   Attempting to load from environment variables...")

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.modules.inventory.routes import router as inventory_router
from app.modules.sales.routes import router as sales_router
from app.modules.products.routes import router as products_router
from app.modules.dashboard.routes import router as dashboard_router
from app.modules.analytics.routes import router as analytics_router
from app.modules.voice.routes import router as voice_router
from app.modules.notifications.routes import router as notifications_router
from app.core.config import settings
from app.core.db import init_db

app = FastAPI(title="Retail Boss API", version="1.0.0")

# Initialize database
init_db()

# CORS middleware
# Parse comma-separated CORS_ORIGINS string into list
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else []
# Always allow localhost:3000 for development
if "http://localhost:3000" not in cors_origins:
    cors_origins.append("http://localhost:3000")

print(f"[OK] CORS configured for origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers to ensure CORS headers are always present, even on errors
def get_cors_headers():
    """Get CORS headers for responses"""
    return {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """HTTP exception handler with CORS headers"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=get_cors_headers()
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Validation exception handler with CORS headers"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
        headers=get_cors_headers()
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler that ensures CORS headers are always present"""
    import traceback
    print(f"[ERROR] Unhandled exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers=get_cors_headers()
    )

# Include routers
app.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
app.include_router(inventory_router, prefix="/inventory", tags=["inventory"])
app.include_router(sales_router, prefix="/sales", tags=["sales"])
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
app.include_router(voice_router, prefix="/voice", tags=["voice"])
app.include_router(notifications_router, prefix="/notifications", tags=["notifications"])

# Billing routes (legacy endpoint, can be moved to sales module later)
from app.modules.sales.service import SalesService
sales_service = SalesService()

@app.post("/api/billing")
async def create_bill(request: dict):
    """Create a new bill - legacy endpoint"""
    return await sales_service.create_bill(request)

@app.get("/api/billing")
async def get_recent_bills():
    """Get recent bills - legacy endpoint"""
    return await sales_service.get_recent_bills()

@app.get("/")
async def root():
    return {"message": "Retail Boss API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from app.core import db
    db_status = "connected" if db.supabase is not None else "not_configured"
    return {
        "status": "ok",
        "database": db_status,
        "version": "1.0.0"
    }
