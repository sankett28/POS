from app.core.db import supabase
from app.utils.barcode import generate_barcode, validate_barcode
from typing import Dict, Any, Optional, List
from fastapi import HTTPException

class ProductService:
    """
    Product service for V1 MVP.
    Handles product catalog operations.
    """

    async def get_products(self) -> Dict[str, Any]:
        """
        Get all products from catalog.
        
        Returns:
            Dictionary with products list
        """
        if supabase is None:
            return {"products": []}

        try:
            # Query all products ordered by name
            response = supabase.table("products") \
                .select("*") \
                .order("name") \
                .execute()

            products = response.data if response.data else []

            # Join with inventory balance for current stock
            for product in products:
                product_id = product["id"]
                balance_response = supabase.table("inventory_balance") \
                    .select("qty_on_hand") \
                    .eq("product_id", product_id) \
                    .execute()
                
                if balance_response.data:
                    product["qty_on_hand"] = float(balance_response.data[0]["qty_on_hand"])
                else:
                    product["qty_on_hand"] = 0.0
            
            return {"products": products}
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching products: {str(e)}"
            )

    async def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific product by ID.
        
        Args:
            product_id: UUID of the product
            
        Returns:
            Product dictionary or None if not found
        """
        if supabase is None:
            return None
        
        try:
            response = supabase.table("products") \
                .select("*") \
                .eq("id", product_id) \
                .execute()
            
            if not response.data:
                return None
            
            product = response.data[0]
            
            # Get current stock
            balance_response = supabase.table("inventory_balance") \
                .select("qty_on_hand") \
                .eq("product_id", product_id) \
                .execute()
            
            if balance_response.data:
                product["qty_on_hand"] = float(balance_response.data[0]["qty_on_hand"])
            else:
                product["qty_on_hand"] = 0.0
            
            return product
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching product: {str(e)}"
            )

    async def get_product_by_barcode(self, barcode: str) -> Optional[Dict[str, Any]]:
        """
        Get product by barcode.
        
        Args:
            barcode: Barcode string
            
        Returns:
            Product dictionary or None if not found
        """
        if supabase is None:
            return None
        
        try:
            response = supabase.table("products") \
                .select("*") \
                .eq("barcode", barcode) \
                .execute()
            
            if not response.data:
                return None
            
            product = response.data[0]
            
            # Get current stock
            product_id = product["id"]
            balance_response = supabase.table("inventory_balance") \
                .select("qty_on_hand") \
                .eq("product_id", product_id) \
                .execute()
            
            if balance_response.data:
                product["qty_on_hand"] = float(balance_response.data[0]["qty_on_hand"])
            else:
                product["qty_on_hand"] = 0.0
            
            return product
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching product by barcode: {str(e)}"
            )

    async def create_product(self, data: dict) -> Dict[str, Any]:
        """
        Create a new product.
        
        Business Rules:
        - SKU must be unique
        - Barcode is auto-generated if not provided
        - Barcode must be unique if provided
        
        Args:
            data: Product data dictionary
            
        Returns:
            Created product dictionary
        """
        if supabase is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        try:
            # Validate required fields
            if not data.get("name"):
                raise HTTPException(status_code=400, detail="Product name is required")
            if not data.get("sku"):
                raise HTTPException(status_code=400, detail="SKU is required")
            if not data.get("unit"):
                raise HTTPException(status_code=400, detail="Unit is required")
            if data.get("selling_price") is None:
                raise HTTPException(status_code=400, detail="Selling price is required")
            
            # Generate barcode if not provided
            barcode = data.get("barcode")
            if not barcode:
                # Generate unique barcode
                barcode = generate_barcode()
                # Ensure uniqueness (retry if collision)
                max_retries = 5
                for _ in range(max_retries):
                    existing = await self.get_product_by_barcode(barcode)
                    if existing is None:
                        break
                    barcode = generate_barcode()
                else:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to generate unique barcode"
                    )
            else:
                # Validate provided barcode
                if not validate_barcode(barcode):
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid barcode format"
                    )
                # Check uniqueness
                existing = await self.get_product_by_barcode(barcode)
                if existing:
                    raise HTTPException(
                        status_code=400,
                        detail="Barcode already exists"
                    )
            
            # Prepare product data
            product_data = {
                "name": data["name"],
                "sku": data["sku"],
                "barcode": barcode,
                "unit": data["unit"],
                "mrp": data.get("mrp"),
                "selling_price": float(data["selling_price"]),
                "tax_rate": float(data.get("tax_rate", 0))
            }
            
            # Insert product
            response = supabase.table("products") \
                .insert(product_data) \
                .execute()
            
            if not response.data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create product"
                )
            
            product = response.data[0]
            
            # Initialize inventory balance to 0
            supabase.table("inventory_balance") \
                .insert({
                    "product_id": product["id"],
                    "qty_on_hand": 0
                }) \
                .execute()
            
            product["qty_on_hand"] = 0.0
            
            return {"success": True, "product": product}
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error creating product: {str(e)}"
            )