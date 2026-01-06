from app.core.db import supabase
from typing import Dict, Any

class InventoryService:
    async def get_inventory(self) -> Dict[str, Any]:
        """Get inventory data"""
        if supabase is None:
            # Return mock data. Replace with actual DB queries later
            return {
                "stats": {
                    "inStock": 236,
                    "lowStock": 12,
                    "expiringSoon": 8,
                    "stockValue": 240000
                },
                "products": [
                    {
                        "id": "MAG001",
                        "name": "Maggi Noodles 2-Min",
                        "category": "Instant Food",
                        "stock": 45,
                        "minLevel": 20,
                        "status": "Good Stock",
                        "forecast": "High demand",
                        "price": 12
                    },
                    {
                        "id": "PAR002",
                        "name": "Parle-G Biscuits",
                        "category": "Biscuits",
                        "stock": 8,
                        "minLevel": 15,
                        "status": "Low Stock",
                        "forecast": "Reorder now",
                        "price": 10
                    },
                    {
                        "id": "TEA003",
                        "name": "Tata Tea Gold",
                        "category": "Beverages",
                        "stock": 32,
                        "minLevel": 25,
                        "status": "Good Stock",
                        "forecast": "Stable",
                        "price": 250
                    },
                    {
                        "id": "AMU004",
                        "name": "Amul Butter 500g",
                        "category": "Dairy",
                        "stock": 3,
                        "minLevel": 10,
                        "status": "Critical",
                        "forecast": "Urgent!",
                        "price": 55
                    }
                ]
            }
        
        try:
            # Query products from Supabase
            products_response = supabase.table("products").select("*").execute()
            products = products_response.data if products_response.data else []
            
            # Calculate stats
            in_stock = sum(1 for p in products if p.get("stock", 0) > 0)
            low_stock = sum(1 for p in products if p.get("stock", 0) < p.get("min_level", 0))
            stock_value = sum(p.get("stock", 0) * p.get("price", 0) for p in products)
            
            # Format products with status
            formatted_products = []
            for product in products:
                stock = product.get("stock", 0)
                min_level = product.get("min_level", 0)
                
                if stock < min_level:
                    status = "Critical" if stock < min_level * 0.5 else "Low Stock"
                else:
                    status = "Good Stock"
                
                formatted_products.append({
                    "id": product.get("id"),
                    "name": product.get("name"),
                    "category": product.get("category"),
                    "stock": stock,
                    "minLevel": min_level,
                    "status": status,
                    "forecast": "Reorder now" if stock < min_level else "Stable",
                    "price": product.get("price", 0)
                })
            
            return {
                "stats": {
                    "inStock": in_stock,
                    "lowStock": low_stock,
                    "expiringSoon": 0,  # TODO: Add expiry date tracking
                    "stockValue": stock_value
                },
                "products": formatted_products
            }
        except Exception as e:
            raise Exception(f"Error fetching inventory: {str(e)}")
    
    async def update_inventory(self, data: dict) -> Dict[str, Any]:
        """Update inventory"""
        if supabase is None:
            return {"success": True, "message": "Inventory updated (mock mode)"}
        
        try:
            product_id = data.get("id")
            if not product_id:
                raise ValueError("Product ID is required")
            
            # Update product stock
            update_data = {}
            if "stock" in data:
                update_data["stock"] = data["stock"]
            if "minLevel" in data:
                update_data["min_level"] = data["minLevel"]
            
            result = supabase.table("products").update(update_data).eq("id", product_id).execute()
            
            return {"success": True, "message": "Inventory updated", "data": result.data}
        except Exception as e:
            raise Exception(f"Error updating inventory: {str(e)}")
