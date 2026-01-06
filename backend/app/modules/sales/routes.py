from fastapi import APIRouter
from app.modules.sales.service import SalesService

router = APIRouter()
service = SalesService()

@router.get("/")
async def get_sales():
    """Get sales data"""
    return await service.get_sales()

@router.post("/")
async def create_sale(request: dict):
    """Create a new sale"""
    return await service.create_sale(request)
