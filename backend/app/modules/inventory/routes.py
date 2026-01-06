from fastapi import APIRouter, HTTPException
from typing import Optional
from app.modules.inventory.service import InventoryService

router = APIRouter()
service = InventoryService()

@router.get("/")
async def get_inventory():
    """Get inventory data"""
    return await service.get_inventory()

@router.post("/")
async def update_inventory(request: dict):
    """Update inventory"""
    return await service.update_inventory(request)
