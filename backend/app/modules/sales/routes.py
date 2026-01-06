from fastapi import APIRouter, Query
from app.modules.sales.service import SalesService

router = APIRouter()
service = SalesService()

@router.get("/")
async def get_sales(limit: int = Query(100, ge=1, le=1000)):
    """Get recent sales bills"""
    return await service.get_sales(limit=limit)

@router.get("/{bill_id}")
async def get_bill(bill_id: str):
    """Get a specific bill by ID"""
    return await service.get_bill(bill_id)

@router.post("/")
async def create_sale(request: dict):
    """Create a new sale (atomic transaction)"""
    return await service.create_sale(request)
