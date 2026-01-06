-- Inventory Ledger (IMMUTABLE)
-- This is the source of truth for all inventory movements
-- RULE: Rows in this table MUST NEVER be updated or deleted

CREATE TABLE IF NOT EXISTS inventory_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    qty_delta NUMERIC NOT NULL,  -- Positive for stock in, negative for stock out
    reason TEXT NOT NULL CHECK (reason IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN')),
    reference_id UUID,  -- Links to sales_bill.id for sales, NULL for adjustments
    created_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT  -- Optional notes for audit trail
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_product_id ON inventory_ledger(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_reference_id ON inventory_ledger(reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_created_at ON inventory_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_reason ON inventory_ledger(reason);

-- Comments
COMMENT ON TABLE inventory_ledger IS 'IMMUTABLE ledger of all inventory movements. Never update or delete rows.';
COMMENT ON COLUMN inventory_ledger.qty_delta IS 'Quantity change: positive = stock in, negative = stock out';
COMMENT ON COLUMN inventory_ledger.reason IS 'Reason for inventory change: PURCHASE, SALE, ADJUSTMENT, RETURN';
COMMENT ON COLUMN inventory_ledger.reference_id IS 'Foreign key to sales_bill.id for sales transactions';

-- Prevent updates and deletes via trigger
CREATE OR REPLACE FUNCTION prevent_ledger_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'inventory_ledger is immutable. Updates and deletes are not allowed.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_inventory_ledger_update
    BEFORE UPDATE ON inventory_ledger
    FOR EACH ROW
    EXECUTE FUNCTION prevent_ledger_mutation();

CREATE TRIGGER prevent_inventory_ledger_delete
    BEFORE DELETE ON inventory_ledger
    FOR EACH ROW
    EXECUTE FUNCTION prevent_ledger_mutation();