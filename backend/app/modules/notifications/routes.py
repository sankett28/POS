from fastapi import APIRouter
from app.modules.notifications.service import NotificationService

router = APIRouter()
service = NotificationService()

@router.get("/")
async def get_notifications():
    """Get notifications"""
    return await service.get_notifications()

@router.put("/")
async def mark_notification_read(request: dict):
    """Mark notification as read"""
    return await service.mark_as_read(request.get("id"))
