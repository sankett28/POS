from datetime import datetime
from app.core.db import supabase
from typing import Optional

def generate_bill_number() -> str:
    """
    Generate a unique bill number.
    
    Format: BILL-YYYYMMDD-XXXX
    Where XXXX is a 4-digit sequence number for the day
    
    This ensures:
    - Chronological ordering
    - Uniqueness per day
    - Human-readable format
    
    Returns:
        Unique bill number string
    """
    if supabase is None:
        # Mock mode: use timestamp
        timestamp = int(datetime.now().timestamp() * 1000) % 10000
        return f"BILL-{datetime.now().strftime('%Y%m%d')}-{str(timestamp).zfill(4)}"
    
    try:
        # Get today's date prefix
        date_prefix = datetime.now().strftime('%Y%m%d')
        bill_prefix = f"BILL-{date_prefix}-"
        
        # Find the highest sequence number for today
        # Query for bills starting with today's prefix
        response = supabase.table("sales_bill")\
            .select("bill_number")\
            .like("bill_number", f"{bill_prefix}%")\
            .order("bill_number", desc=True)\
            .limit(1)\
            .execute()
        
        if response.data and len(response.data) > 0:
            # Extract sequence number from last bill
            last_bill = response.data[0]["bill_number"]
            try:
                last_seq = int(last_bill.split("-")[-1])
                next_seq = last_seq + 1
            except:
                next_seq = 1
        else:
            next_seq = 1
        
        # Format with 4 digits
        bill_number = f"{bill_prefix}{str(next_seq).zfill(4)}"
        
        return bill_number
        
    except Exception as e:
        # Fallback to timestamp-based if query fails
        timestamp = int(datetime.now().timestamp() * 1000) % 10000
        return f"BILL-{datetime.now().strftime('%Y%m%d')}-{str(timestamp).zfill(4)}"