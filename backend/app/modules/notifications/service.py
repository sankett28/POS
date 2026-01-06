from app.core.db import supabase
from typing import Dict, Any, List
from datetime import datetime, timedelta

class NotificationService:
    async def get_notifications(self) -> List[Dict[str, Any]]:
        """Get notifications"""
        if supabase is None:
            # Return mock data
            return [
                {
                    "id": 1,
                    "type": "low-stock",
                    "title": "Low Stock Alert",
                    "message": "Parle-G Biscuits: Only 8 units left",
                    "timestamp": (datetime.now() - timedelta(minutes=2)).isoformat(),
                    "unread": True
                },
                {
                    "id": 2,
                    "type": "high-demand",
                    "title": "High Demand Detected",
                    "message": "Maggi sales up 45% - consider restocking",
                    "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
                    "unread": True
                },
                {
                    "id": 3,
                    "type": "festival",
                    "title": "Festival Reminder",
                    "message": "Diwali in 15 days - prepare inventory",
                    "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
                    "unread": False
                }
            ]
        
        try:
            response = supabase.table("notifications").select("*").order("created_at", desc=True).limit(50).execute()
            notifications = []
            for notif in (response.data if response.data else []):
                notifications.append({
                    "id": notif.get("id"),
                    "type": notif.get("type"),
                    "title": notif.get("title"),
                    "message": notif.get("message"),
                    "timestamp": notif.get("created_at"),
                    "unread": notif.get("unread", True)
                })
            return notifications
        except Exception as e:
            raise Exception(f"Error fetching notifications: {str(e)}")
    
    async def mark_as_read(self, notification_id: int) -> Dict[str, Any]:
        """Mark notification as read"""
        if supabase is None:
            return {"success": True, "message": "Notification marked as read (mock mode)"}
        
        try:
            supabase.table("notifications").update({"unread": False}).eq("id", notification_id).execute()
            return {"success": True, "message": "Notification marked as read"}
        except Exception as e:
            raise Exception(f"Error marking notification as read: {str(e)}")
