from app.core.db import supabase
from typing import Dict, Any
from datetime import datetime, timedelta

class DashboardService:
    async def get_dashboard(self) -> Dict[str, Any]:
        """Get dashboard data"""
        if supabase is None:
            # Return mock data
            return {
                "sales": {
                    "today": 45280,
                    "yesterday": 40250,
                    "trend": 12.5
                },
                "products": {
                    "total": 248,
                    "lowStock": 12
                },
                "customers": {
                    "active": 1247,
                    "newThisWeek": 89,
                    "trend": 8.2
                },
                "revenue": {
                    "monthly": 820000,
                    "target": 1000000,
                    "trend": 15.3
                },
                "salesTrend": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [32000, 35000, 38000, 36000, 40000, 45000, 42000]
                },
                "categories": {
                    "labels": ["Groceries", "Beverages", "Snacks", "Dairy", "Others"],
                    "data": [35, 25, 20, 15, 5]
                },
                "insights": [
                    {
                        "type": "high-demand",
                        "title": "High Demand Alert",
                        "message": "Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.",
                        "action": "Act Now"
                    },
                    {
                        "type": "low-stock",
                        "title": "Low Stock Warning",
                        "message": "12 products below minimum level. Estimated stockout in 2-3 days.",
                        "action": "View Items"
                    },
                    {
                        "type": "festival",
                        "title": "Festival Forecast",
                        "message": "Diwali in 15 days. AI predicts 60% increase in sweets & snacks demand.",
                        "action": "Prepare"
                    }
                ]
            }
        
        try:
            # Calculate today's sales
            today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_sales_response = supabase.table("sales").select("total_amount").gte("created_at", today_start.isoformat()).execute()
            today_sales = sum(sale.get("total_amount", 0) for sale in (today_sales_response.data or []))
            
            # Calculate yesterday's sales
            yesterday_start = today_start - timedelta(days=1)
            yesterday_sales_response = supabase.table("sales").select("total_amount").gte("created_at", yesterday_start.isoformat()).lt("created_at", today_start.isoformat()).execute()
            yesterday_sales = sum(sale.get("total_amount", 0) for sale in (yesterday_sales_response.data or []))
            
            trend = ((today_sales - yesterday_sales) / yesterday_sales * 100) if yesterday_sales > 0 else 0
            
            # Get product stats
            products_response = supabase.table("products").select("id, stock, min_level").execute()
            products = products_response.data if products_response.data else []
            total_products = len(products)
            low_stock = sum(1 for p in products if p.get("stock", 0) < p.get("min_level", 0))
            
            # Get monthly revenue
            month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            monthly_sales_response = supabase.table("sales").select("total_amount").gte("created_at", month_start.isoformat()).execute()
            monthly_revenue = sum(sale.get("total_amount", 0) for sale in (monthly_sales_response.data or []))
            
            return {
                "sales": {
                    "today": today_sales,
                    "yesterday": yesterday_sales,
                    "trend": round(trend, 2)
                },
                "products": {
                    "total": total_products,
                    "lowStock": low_stock
                },
                "customers": {
                    "active": 1247,  # TODO: Calculate from customers table
                    "newThisWeek": 89,
                    "trend": 8.2
                },
                "revenue": {
                    "monthly": monthly_revenue,
                    "target": 1000000,
                    "trend": 15.3
                },
                "salesTrend": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [32000, 35000, 38000, 36000, 40000, 45000, 42000]  # TODO: Calculate from actual data
                },
                "categories": {
                    "labels": ["Groceries", "Beverages", "Snacks", "Dairy", "Others"],
                    "data": [35, 25, 20, 15, 5]  # TODO: Calculate from actual data
                },
                "insights": [
                    {
                        "type": "high-demand",
                        "title": "High Demand Alert",
                        "message": "Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.",
                        "action": "Act Now"
                    },
                    {
                        "type": "low-stock",
                        "title": "Low Stock Warning",
                        "message": f"{low_stock} products below minimum level. Estimated stockout in 2-3 days.",
                        "action": "View Items"
                    }
                ]
            }
        except Exception as e:
            raise Exception(f"Error fetching dashboard data: {str(e)}")
