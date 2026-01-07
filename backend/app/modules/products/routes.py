from fastapi import APIRouter, HTTPException, Query
from app.modules.products.service import ProductService

router = APIRouter()
service = ProductService()

@router.get("/")
async def get_products():
    """Get all products"""
    return await service.get_products()

@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a specific product by ID"""
    product = await service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/barcode/{barcode}")
async def get_product_by_barcode(barcode: str):
    """Get product by barcode"""
    product = await service.get_product_by_barcode(barcode)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/")
async def create_product(request: dict):
    """Create a new product"""
    return await service.create_product(request)
