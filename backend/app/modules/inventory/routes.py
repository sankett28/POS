from fastapi import APIRouter
from app.modules.inventory.service import InventoryService

router = APIRouter()
service = InventoryService()

@router.get("/")
async def get_inventory():
    """Get current inventory status"""
    # Service already handles all exceptions and returns valid data structure
    return await service.get_inventory()

@router.post("/stock-in")
async def add_stock(request: dict):
    """Add stock to inventory (STOCK IN)"""
    return await service.add_stock(request)

@router.post("/adjust")
async def adjust_stock(request: dict):
    """Adjust stock (for corrections)"""
    return await service.adjust_stock(request)
