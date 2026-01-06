-- Inventory logs table for tracking stock changes
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'add', 'remove', 'adjust', 'sale'
    quantity INTEGER NOT NULL,
    previous_stock INTEGER,
    new_stock INTEGER,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at);

-- Function to decrease stock atomically
CREATE OR REPLACE FUNCTION decrease_stock(product_id VARCHAR, quantity INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_stock INTEGER;
    new_stock INTEGER;
BEGIN
    -- Get current stock
    SELECT stock INTO current_stock FROM products WHERE id = product_id;
    
    -- Check if sufficient stock
    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    IF current_stock < quantity THEN
        RAISE EXCEPTION 'Insufficient stock';
    END IF;
    
    -- Update stock
    new_stock := current_stock - quantity;
    UPDATE products SET stock = new_stock WHERE id = product_id;
    
    -- Log the change
    INSERT INTO inventory_logs (product_id, change_type, quantity, previous_stock, new_stock, reason)
    VALUES (product_id, 'sale', quantity, current_stock, new_stock, 'Sale transaction');
    
    RETURN new_stock;
END;
$$ LANGUAGE plpgsql;
