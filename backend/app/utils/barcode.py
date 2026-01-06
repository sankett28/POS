def generate_barcode(product_id: str) -> str:
    """Generate barcode for a product"""
    # TODO: Implement barcode generation logic
    return f"BAR-{product_id}"

def validate_barcode(barcode: str) -> bool:
    """Validate barcode format"""
    return barcode.startswith("BAR-")
