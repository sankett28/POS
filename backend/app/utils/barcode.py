import uuid
import random

def generate_barcode(product_id: str = None) -> str:
    """
    Generate a unique barcode for a product.
    
    For V1 MVP, we use a simple format: EAN-13 compatible format
    Format: 8XXXXX + random 5 digits + check digit
    
    Args:
        product_id: Optional product ID to seed the barcode
        
    Returns:
        A 13-digit barcode string
    """
    # Generate 12 digits (8 prefix + 4 random)
    prefix = "8900000"  # Indian country code prefix
    if product_id:
        # Use last 4 chars of UUID if provided
        try:
            suffix = str(abs(hash(product_id)))[:5].zfill(5)
        except:
            suffix = str(random.randint(10000, 99999))
    else:
        suffix = str(random.randint(10000, 99999))
    
    barcode_12 = prefix + suffix
    
    # Calculate EAN-13 check digit
    check_digit = calculate_ean13_check_digit(barcode_12)
    
    return barcode_12 + str(check_digit)

def calculate_ean13_check_digit(barcode_12: str) -> int:
    """
    Calculate EAN-13 check digit.
    
    Algorithm:
    1. Sum digits at odd positions (1-indexed)
    2. Sum digits at even positions and multiply by 3
    3. Add both sums
    4. Check digit = (10 - (sum % 10)) % 10
    """
    digits = [int(d) for d in barcode_12]
    odd_sum = sum(digits[i] for i in range(0, 12, 2))  # 0, 2, 4, 6, 8, 10
    even_sum = sum(digits[i] for i in range(1, 12, 2))  # 1, 3, 5, 7, 9, 11
    total = odd_sum + (even_sum * 3)
    check_digit = (10 - (total % 10)) % 10
    return check_digit

def validate_barcode(barcode: str) -> bool:
    """
    Validate barcode format and check digit.
    
    Args:
        barcode: 13-digit barcode string
        
    Returns:
        True if valid, False otherwise
    """
    if not barcode or len(barcode) != 13:
        return False
    
    if not barcode.isdigit():
        return False
    
    # Validate check digit
    barcode_12 = barcode[:12]
    expected_check = calculate_ean13_check_digit(barcode_12)
    actual_check = int(barcode[12])
    
    return expected_check == actual_check