from fastapi import APIRouter
from app.modules.analytics.service import AnalyticsService

router = APIRouter()
service = AnalyticsService()

@router.get("/")
async def get_analytics():
    """Get analytics data"""
    return await service.get_analytics()
