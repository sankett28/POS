from app.core.db import supabase
from typing import Dict, Any, Optional

class ProductService:
    async def get_products(self) -> Dict[str, Any]:
        """Get all products"""
        if supabase is None:
            return {"products": []}
        
        try:
            response = supabase.table("products").select("*").execute()
            return {"products": response.data if response.data else []}
        except Exception as e:
            raise Exception(f"Error fetching products: {str(e)}")
    
    async def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific product"""
        if supabase is None:
            return None
        
        try:
            response = supabase.table("products").select("*").eq("id", product_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error fetching product: {str(e)}")
    
    async def create_product(self, data: dict) -> Dict[str, Any]:
        """Create a new product"""
        if supabase is None:
            return {"success": True, "message": "Product created (mock mode)"}
        
        try:
            product_data = {
                "id": data.get("id"),
                "name": data.get("name"),
                "category": data.get("category"),
                "stock": data.get("stock", 0),
                "min_level": data.get("minLevel", 0),
                "price": data.get("price", 0),
                "barcode": data.get("barcode")
            }
            
            response = supabase.table("products").insert(product_data).execute()
            return {"success": True, "product": response.data[0] if response.data else None}
        except Exception as e:
            raise Exception(f"Error creating product: {str(e)}")
    
    async def update_product(self, product_id: str, data: dict) -> Dict[str, Any]:
        """Update a product"""
        if supabase is None:
            return {"success": True, "message": "Product updated (mock mode)"}
        
        try:
            update_data = {}
            if "name" in data:
                update_data["name"] = data["name"]
            if "category" in data:
                update_data["category"] = data["category"]
            if "stock" in data:
                update_data["stock"] = data["stock"]
            if "minLevel" in data:
                update_data["min_level"] = data["minLevel"]
            if "price" in data:
                update_data["price"] = data["price"]
            if "barcode" in data:
                update_data["barcode"] = data["barcode"]
            
            response = supabase.table("products").update(update_data).eq("id", product_id).execute()
            return {"success": True, "product": response.data[0] if response.data else None}
        except Exception as e:
            raise Exception(f"Error updating product: {str(e)}")
    
    async def delete_product(self, product_id: str) -> Dict[str, Any]:
        """Delete a product"""
        if supabase is None:
            return {"success": True, "message": "Product deleted (mock mode)"}
        
        try:
            supabase.table("products").delete().eq("id", product_id).execute()
            return {"success": True, "message": "Product deleted"}
        except Exception as e:
            raise Exception(f"Error deleting product: {str(e)}")
