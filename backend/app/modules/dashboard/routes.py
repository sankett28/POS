from fastapi import APIRouter
from app.modules.dashboard.service import DashboardService

router = APIRouter()
service = DashboardService()

@router.get("/")
async def get_dashboard():
    """Get dashboard data"""
    return await service.get_dashboard()
