from app.core.db import supabase
from typing import Dict, Any, List
from fastapi import HTTPException
from decimal import Decimal
import uuid

class InventoryService:
    """
    Inventory service for V1 MVP.
    Handles stock management using ledger-based approach.
    """
    
    async def get_inventory(self) -> Dict[str, Any]:
        """
        Get current inventory status.
        
        Returns:
            Dictionary with inventory stats and product list
        """
        if supabase is None:
            return {
                "stats": {
                    "inStock": 0,
                    "lowStock": 0,
                    "stockValue": 0
                },
                "products": []
            }
        
        try:
            # Get all products with their balances
            products_response = supabase.table("products")\
                .select("id, name, sku, unit, selling_price")\
                .execute()
            
            products = products_response.data if products_response.data else []
            
            # Get balances for all products
            balance_response = supabase.table("inventory_balance")\
                .select("product_id, qty_on_hand")\
                .execute()
            
            # Create balance lookup
            balance_map = {
                item["product_id"]: float(item["qty_on_hand"])
                for item in (balance_response.data if balance_response.data else [])
            }
            
            # Format products with stock info
            formatted_products = []
            in_stock_count = 0
            low_stock_count = 0
            total_stock_value = 0
            
            for product in products:
                product_id = product["id"]
                qty_on_hand = balance_map.get(product_id, 0.0)
                selling_price = float(product.get("selling_price", 0))
                
                if qty_on_hand > 0:
                    in_stock_count += 1
                if qty_on_hand < 5:  # Low stock threshold
                    low_stock_count += 1
                
                total_stock_value += qty_on_hand * selling_price
                
                formatted_products.append({
                    "id": product_id,
                    "name": product["name"],
                    "sku": product["sku"],
                    "unit": product["unit"],
                    "qty_on_hand": qty_on_hand,
                    "selling_price": selling_price,
                    "stock_value": qty_on_hand * selling_price
                })
            
            return {
                "stats": {
                    "inStock": in_stock_count,
                    "lowStock": low_stock_count,
                    "stockValue": round(total_stock_value, 2)
                },
                "products": formatted_products
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching inventory: {str(e)}"
            )
    
    async def add_stock(self, data: dict) -> Dict[str, Any]:
        """
        Add stock to inventory (STOCK IN).
        
        Business Rules:
        - Stock can ONLY be added via ledger entry
        - Creates ledger entry with positive qty_delta
        - Balance is updated automatically via trigger
        
        Args:
            data: Dictionary with product_id, quantity, reason, notes
            
        Returns:
            Success response with ledger entry
        """
        if supabase is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        try:
            product_id = data.get("product_id")
            quantity = data.get("quantity")
            reason = data.get("reason", "PURCHASE")
            notes = data.get("notes")
            
            if not product_id:
                raise HTTPException(status_code=400, detail="product_id is required")
            if not quantity or quantity <= 0:
                raise HTTPException(status_code=400, detail="quantity must be positive")
            
            # Validate reason
            valid_reasons = ["PURCHASE", "ADJUSTMENT", "RETURN"]
            if reason not in valid_reasons:
                raise HTTPException(
                    status_code=400,
                    detail=f"reason must be one of: {', '.join(valid_reasons)}"
                )
            
            # Verify product exists
            product_response = supabase.table("products")\
                .select("id")\
                .eq("id", product_id)\
                .execute()
            
            if not product_response.data:
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Insert ledger entry (positive qty_delta for stock in)
            ledger_data = {
                "product_id": product_id,
                "qty_delta": float(quantity),
                "reason": reason,
                "reference_id": None,
                "notes": notes
            }
            
            ledger_response = supabase.table("inventory_ledger")\
                .insert(ledger_data)\
                .execute()
            
            if not ledger_response.data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create ledger entry"
                )
            
            # Balance is updated automatically by trigger
            # Fetch updated balance
            balance_response = supabase.table("inventory_balance")\
                .select("qty_on_hand")\
                .eq("product_id", product_id)\
                .execute()
            
            qty_on_hand = 0.0
            if balance_response.data:
                qty_on_hand = float(balance_response.data[0]["qty_on_hand"])
            
            return {
                "success": True,
                "ledger_entry": ledger_response.data[0],
                "qty_on_hand": qty_on_hand
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error adding stock: {str(e)}"
            )
    
    async def adjust_stock(self, data: dict) -> Dict[str, Any]:
        """
        Adjust stock (for corrections, damages, etc.).
        
        Args:
            data: Dictionary with product_id, quantity (can be negative), notes
            
        Returns:
            Success response
        """
        if supabase is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        try:
            product_id = data.get("product_id")
            quantity = data.get("quantity")
            notes = data.get("notes", "Stock adjustment")
            
            if not product_id:
                raise HTTPException(status_code=400, detail="product_id is required")
            if quantity is None:
                raise HTTPException(status_code=400, detail="quantity is required")
            
            # Verify product exists
            product_response = supabase.table("products")\
                .select("id")\
                .eq("id", product_id)\
                .execute()
            
            if not product_response.data:
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Check if adjustment would result in negative stock
            if quantity < 0:
                balance_response = supabase.table("inventory_balance")\
                    .select("qty_on_hand")\
                    .eq("product_id", product_id)\
                    .execute()
                
                current_qty = 0.0
                if balance_response.data:
                    current_qty = float(balance_response.data[0]["qty_on_hand"])
                
                if current_qty + quantity < 0:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock. Current: {current_qty}, Adjustment: {quantity}"
                    )
            
            # Insert ledger entry
            ledger_data = {
                "product_id": product_id,
                "qty_delta": float(quantity),
                "reason": "ADJUSTMENT",
                "reference_id": None,
                "notes": notes
            }
            
            ledger_response = supabase.table("inventory_ledger")\
                .insert(ledger_data)\
                .execute()
            
            if not ledger_response.data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create ledger entry"
                )
            
            # Fetch updated balance
            balance_response = supabase.table("inventory_balance")\
                .select("qty_on_hand")\
                .eq("product_id", product_id)\
                .execute()
            
            qty_on_hand = 0.0
            if balance_response.data:
                qty_on_hand = float(balance_response.data[0]["qty_on_hand"])
            
            return {
                "success": True,
                "ledger_entry": ledger_response.data[0],
                "qty_on_hand": qty_on_hand
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error adjusting stock: {str(e)}"
            )
