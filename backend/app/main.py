from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(inventory_router, prefix="/api/inventory", tags=["inventory"])
app.include_router(sales_router, prefix="/api/sales", tags=["sales"])
app.include_router(products_router, prefix="/api/products", tags=["products"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["analytics"])
app.include_router(voice_router, prefix="/api/voice", tags=["voice"])
app.include_router(notifications_router, prefix="/api/notifications", tags=["notifications"])

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
