from fastapi import APIRouter, HTTPException
from app.modules.products.service import ProductService

router = APIRouter()
service = ProductService()

@router.get("/")
async def get_products():
    """Get all products"""
    return await service.get_products()

@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a specific product"""
    product = await service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/")
async def create_product(request: dict):
    """Create a new product"""
    return await service.create_product(request)

@router.put("/{product_id}")
async def update_product(product_id: str, request: dict):
    """Update a product"""
    return await service.update_product(product_id, request)

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    return await service.delete_product(product_id)
