from app.core.db import supabase
from app.utils.bill_number import generate_bill_number
from datetime import datetime
from typing import Dict, Any
from fastapi import HTTPException

class SalesService:
    async def get_sales(self) -> Dict[str, Any]:
        """Get sales data"""
        if supabase is None:
            return {"sales": []}
        
        try:
            # Query recent sales
            response = supabase.table("sales").select("*").order("created_at", desc=True).limit(100).execute()
            return {"sales": response.data if response.data else []}
        except Exception as e:
            raise Exception(f"Error fetching sales: {str(e)}")
    
    async def create_sale(self, data: dict) -> Dict[str, Any]:
        """Create a new sale"""
        items = data.get("items", [])
        if not items or len(items) == 0:
            raise HTTPException(status_code=400, detail="Sale must have at least one item")
        
        if supabase is None:
            # Mock mode
            invoice_number = generate_bill_number()
            return {
                "success": True,
                "invoice": {
                    "invoiceNumber": invoice_number,
                    "items": items,
                    "subtotal": data.get("subtotal", 0),
                    "gst": data.get("gst", 0),
                    "total": data.get("total", 0),
                    "paymentMethod": data.get("paymentMethod"),
                    "timestamp": datetime.now().isoformat(),
                    "status": "completed"
                }
            }
        
        try:
            invoice_number = generate_bill_number()
            
            # Create sale record
            sale_data = {
                "invoice_number": invoice_number,
                "total_amount": data.get("total", 0),
                "subtotal": data.get("subtotal", 0),
                "gst": data.get("gst", 0),
                "payment_method": data.get("paymentMethod"),
                "status": "completed"
            }
            
            sale_response = supabase.table("sales").insert(sale_data).execute()
            sale_id = sale_response.data[0]["id"] if sale_response.data else None
            
            # Create sale items
            sale_items = []
            for item in items:
                item_data = {
                    "sale_id": sale_id,
                    "product_id": item.get("productId"),
                    "quantity": item.get("quantity", 1),
                    "price": item.get("price", 0),
                    "total": item.get("total", 0)
                }
                sale_items.append(item_data)
            
            if sale_items:
                supabase.table("sale_items").insert(sale_items).execute()
            
            # Update inventory stock (atomic operation)
            for item in items:
                product_id = item.get("productId")
                quantity = item.get("quantity", 0)
                if product_id and quantity > 0:
                    # Decrease stock atomically
                    supabase.rpc("decrease_stock", {
                        "product_id": product_id,
                        "quantity": quantity
                    }).execute()
            
            return {
                "success": True,
                "invoice": {
                    "invoiceNumber": invoice_number,
                    "items": items,
                    "subtotal": data.get("subtotal", 0),
                    "gst": data.get("gst", 0),
                    "total": data.get("total", 0),
                    "paymentMethod": data.get("paymentMethod"),
                    "timestamp": datetime.now().isoformat(),
                    "status": "completed"
                }
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating sale: {str(e)}")
    
    async def create_bill(self, data: dict) -> Dict[str, Any]:
        """Create a bill (legacy endpoint)"""
        return await self.create_sale(data)
    
    async def get_recent_bills(self) -> list:
        """Get recent bills (legacy endpoint)"""
        if supabase is None:
            return [{
                "invoiceNumber": "INV-2025-001",
                "total": 327,
                "items": 3,
                "timestamp": datetime.now().isoformat()
            }]
        
        try:
            response = supabase.table("sales").select("invoice_number, total_amount, created_at").order("created_at", desc=True).limit(10).execute()
            bills = []
            for sale in (response.data if response.data else []):
                bills.append({
                    "invoiceNumber": sale.get("invoice_number"),
                    "total": sale.get("total_amount", 0),
                    "items": 0,  # TODO: Count items
                    "timestamp": sale.get("created_at")
                })
            return bills
        except Exception as e:
            raise Exception(f"Error fetching bills: {str(e)}")
