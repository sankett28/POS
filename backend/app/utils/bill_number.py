from datetime import datetime

def generate_bill_number() -> str:
    """Generate a unique bill number"""
    year = datetime.now().year
    random_num = str(int(datetime.now().timestamp() * 1000) % 10000).zfill(4)
    return f"INV-{year}-{random_num}"
