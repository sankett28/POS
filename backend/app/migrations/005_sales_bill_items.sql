-- Sales Bill Items (IMMUTABLE)
-- Line items for each bill with SNAPSHOT data
-- RULE: Items cannot be modified after bill creation

CREATE TABLE IF NOT EXISTS sales_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES sales_bill(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),  -- Can be NULL if product deleted
    product_name TEXT NOT NULL,  -- SNAPSHOT: Product name at time of sale
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    tax_rate NUMERIC(5,2) NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 100),
    line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sales_bill_items_bill_id ON sales_bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_sales_bill_items_product_id ON sales_bill_items(product_id);

-- Comments
COMMENT ON TABLE sales_bill_items IS 'IMMUTABLE line items for sales bills. Contains snapshot data.';
COMMENT ON COLUMN sales_bill_items.product_name IS 'SNAPSHOT: Product name at time of sale (for audit)';
COMMENT ON COLUMN sales_bill_items.unit_price IS 'SNAPSHOT: Price per unit at time of sale';
COMMENT ON COLUMN sales_bill_items.tax_rate IS 'SNAPSHOT: Tax rate at time of sale';

-- Prevent updates and deletes
CREATE TRIGGER prevent_sales_bill_items_update
    BEFORE UPDATE ON sales_bill_items
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bill_mutation();

CREATE TRIGGER prevent_sales_bill_items_delete
    BEFORE DELETE ON sales_bill_items
    FOR EACH ROW
    EXECUTE FUNCTION prevent_bill_mutation();