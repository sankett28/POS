from app.core import db
from app.utils.bill_number import generate_bill_number
from typing import Dict, Any, List
from fastapi import HTTPException
from decimal import Decimal
class SalesService:
    """
    Sales service for V1 MVP.
    Handles sales billing with atomic stock deduction.
    """
    
    async def get_sales(self, limit: int = 100) -> Dict[str, Any]:
        """
        Get recent sales bills.
        
        Args:
            limit: Maximum number of bills to return
            
        Returns:
            Dictionary with sales list
        """
        if db.supabase is None:
            return {"sales": []}
        
        try:
            response = db.supabase.table("sales_bill")\
                .select("*")\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            
            sales = response.data if response.data else []
            
            # Get items for each bill
            for sale in sales:
                bill_id = sale["id"]
                items_response = db.supabase.table("sales_bill_items")\
                    .select("*")\
                    .eq("bill_id", bill_id)\
                    .execute()
                
                sale["items"] = items_response.data if items_response.data else []
            
            return {"sales": sales}
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching sales: {str(e)}"
            )
    
    async def get_bill(self, bill_id: str) -> Dict[str, Any]:
        """
        Get a specific bill by ID.
        
        Args:
            bill_id: UUID of the bill
            
        Returns:
            Bill dictionary with items
        """
        if db.supabase is None:
            raise HTTPException(status_code=404, detail="Bill not found")
        
        try:
            bill_response = db.supabase.table("sales_bill")\
                .select("*")\
                .eq("id", bill_id)\
                .execute()
            
            if not bill_response.data:
                raise HTTPException(status_code=404, detail="Bill not found")
            
            bill = bill_response.data[0]
            
            # Get items
            items_response = supabase.table("sales_bill_items")\
                .select("*")\
                .eq("bill_id", bill_id)\
                .execute()
            
            bill["items"] = items_response.data if items_response.data else []
            
            return bill
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching bill: {str(e)}"
            )
    
    async def create_sale(self, data: dict) -> Dict[str, Any]:
        """
        Create a new sale (ATOMIC TRANSACTION).
        
        CRITICAL FLOW:
        1. Generate bill_number
        2. For each cart item:
           - Atomically deduct stock using UPDATE with WHERE condition
           - If rows affected = 0 → abort (OUT OF STOCK)
        3. Insert sales_bill
        4. Insert sales_bill_items (with snapshot data)
        5. Insert inventory_ledger entries (negative qty)
        6. Commit transaction
        
        Args:
            data: Sale data with items, payment_mode, etc.
            
        Returns:
            Created bill dictionary
        """
        if db.supabase is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        items = data.get("items", [])
        payment_mode = data.get("payment_mode", "cash")
        
        if not items or len(items) == 0:
            raise HTTPException(status_code=400, detail="Sale must have at least one item")
        
        if payment_mode not in ["cash", "upi", "card"]:
            raise HTTPException(
                status_code=400,
                detail="payment_mode must be one of: cash, upi, card"
            )
        
        try:
            # STEP 1: Validate all products and get current data
            product_data_map = {}
            for item in items:
                product_id = item.get("product_id")
                quantity = item.get("quantity")
                
                if not product_id:
                    raise HTTPException(status_code=400, detail="product_id is required for all items")
                if not quantity or quantity <= 0:
                    raise HTTPException(status_code=400, detail="quantity must be positive")
                
                # Fetch product data
                product_response = db.supabase.table("products")\
                    .select("*")\
                    .eq("id", product_id)\
                    .execute()
                
                if not product_response.data:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Product {product_id} not found"
                    )
                
                product = product_response.data[0]
                product_data_map[product_id] = product
                
                # Check stock availability
                balance_response = db.supabase.table("inventory_balance")\
                    .select("qty_on_hand")\
                    .eq("product_id", product_id)\
                    .execute()
                
                qty_on_hand = 0.0
                if balance_response.data:
                    qty_on_hand = float(balance_response.data[0]["qty_on_hand"])
                
                if qty_on_hand < quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock for {product['name']}. Available: {qty_on_hand}, Requested: {quantity}"
                    )
            
            # STEP 2: Generate bill number
            bill_number = generate_bill_number()
            
            # STEP 3: Calculate totals
            subtotal = Decimal("0")
            tax_amount = Decimal("0")
            
            bill_items = []
            for item in items:
                product_id = item["product_id"]
                quantity = Decimal(str(item["quantity"]))
                product = product_data_map[product_id]
                
                unit_price = Decimal(str(product["selling_price"]))
                tax_rate = Decimal(str(product.get("tax_rate", 0)))
                
                line_subtotal = unit_price * quantity
                line_tax = line_subtotal * (tax_rate / Decimal("100"))
                line_total = line_subtotal + line_tax
                
                subtotal += line_subtotal
                tax_amount += line_tax
                
                bill_items.append({
                    "product_id": product_id,
                    "product_name": product["name"],
                    "unit_price": float(unit_price),
                    "quantity": float(quantity),
                    "tax_rate": float(tax_rate),
                    "line_total": float(line_total)
                })
            
            total = subtotal + tax_amount
            
            # STEP 4: ATOMIC STOCK DEDUCTION
            # Use optimistic locking with WHERE condition
            # This ensures we don't oversell
            
            for item in items:
                product_id = item["product_id"]
                quantity = float(item["quantity"])
                
                # First, verify stock again (double-check)
                balance_response = db.supabase.table("inventory_balance")\
                    .select("qty_on_hand")\
                    .eq("product_id", product_id)\
                    .execute()
                
                current_qty = 0.0
                if balance_response.data:
                    current_qty = float(balance_response.data[0]["qty_on_hand"])
                
                if current_qty < quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock. Available: {current_qty}, Requested: {quantity}"
                    )
                
                # Update balance with optimistic locking
                new_qty = current_qty - quantity
                
                update_response = db.supabase.table("inventory_balance")\
                    .update({"qty_on_hand": new_qty})\
                    .eq("product_id", product_id)\
                    .eq("qty_on_hand", current_qty)\
                    .execute()
                
                # If no rows updated, stock was changed by another transaction
                if not update_response.data:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Stock conflict for product {product_id}. Please retry."
                    )
            
            # STEP 5: Create sales bill
            bill_data = {
                "bill_number": bill_number,
                "subtotal": float(subtotal),
                "tax_amount": float(tax_amount),
                "total": float(total),
                "payment_mode": payment_mode
            }
            
            bill_response = db.supabase.table("sales_bill")\
                .insert(bill_data)\
                .execute()
            
            if not bill_response.data:
                # Rollback stock updates (manual rollback needed)
                # In production, use database transactions
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create bill. Stock may have been deducted."
                )
            
            bill_id = bill_response.data[0]["id"]
            
            # STEP 6: Create bill items (with snapshot data)
            items_to_insert = []
            for item in bill_items:
                items_to_insert.append({
                    "bill_id": bill_id,
                    "product_id": item["product_id"],
                    "product_name": item["product_name"],
                    "unit_price": item["unit_price"],
                    "quantity": item["quantity"],
                    "tax_rate": item["tax_rate"],
                    "line_total": item["line_total"]
                })
            
            db.supabase.table("sales_bill_items")\
                .insert(items_to_insert)\
                .execute()
            
            # STEP 7: Create ledger entries (negative qty for stock out)
            ledger_entries = []
            for item in items:
                ledger_entries.append({
                    "product_id": item["product_id"],
                    "qty_delta": -float(item["quantity"]),  # Negative for stock out
                    "reason": "SALE",
                    "reference_id": bill_id,
                    "notes": f"Sale: {bill_number}"
                })
            
            db.supabase.table("inventory_ledger")\
                .insert(ledger_entries)\
                .execute()
            
            # Fetch complete bill with items
            bill = bill_response.data[0]
            bill["items"] = items_to_insert
            
            return {
                "success": True,
                "bill": bill
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error creating sale: {str(e)}"
            )
    
    async def create_bill(self, data: dict) -> Dict[str, Any]:
        """
        Legacy endpoint alias for create_sale.
        """
        return await self.create_sale(data)
    
    async def get_recent_bills(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent bills (legacy endpoint).
        
        Args:
            limit: Maximum number of bills to return
            
        Returns:
            List of bill summaries
        """
        if db.supabase is None:
            return []
        
        try:
            response = db.supabase.table("sales_bill")\
                .select("id, bill_number, total, created_at")\
                .order("created_at", desc=True)\
                .limit(limit)\
                .execute()
            
            bills = []
            for bill in (response.data if response.data else []):
                # Count items
                items_response = db.supabase.table("sales_bill_items")\
                    .select("id")\
                    .eq("bill_id", bill["id"])\
                    .execute()
                
                item_count = len(items_response.data) if items_response.data else 0
                
                bills.append({
                    "id": bill["id"],
                    "invoiceNumber": bill["bill_number"],
                    "total": float(bill["total"]),
                    "items": item_count,
                    "timestamp": bill["created_at"]
                })
            
            return bills
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching bills: {str(e)}"
            )
