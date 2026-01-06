-- Inventory Balance (CACHE TABLE)
-- This is a denormalized cache for fast stock lookups
-- Updated via triggers or explicit UPSERT after ledger entries

CREATE TABLE IF NOT EXISTS inventory_balance (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    qty_on_hand NUMERIC NOT NULL DEFAULT 0 CHECK (qty_on_hand >= 0),
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_inventory_balance_qty ON inventory_balance(qty_on_hand);

-- Comments
COMMENT ON TABLE inventory_balance IS 'CACHE: Denormalized current stock levels. Recalculate from inventory_ledger if needed.';
COMMENT ON COLUMN inventory_balance.qty_on_hand IS 'Current quantity on hand. Must be >= 0.';

-- Function to update balance from ledger entry
-- This is called AFTER inserting into inventory_ledger
CREATE OR REPLACE FUNCTION update_inventory_balance()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory_balance (product_id, qty_on_hand, last_updated)
    VALUES (NEW.product_id, NEW.qty_delta, now())
    ON CONFLICT (product_id)
    DO UPDATE SET
        qty_on_hand = inventory_balance.qty_on_hand + NEW.qty_delta,
        last_updated = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update balance when ledger entry is created
CREATE TRIGGER update_balance_on_ledger_insert
    AFTER INSERT ON inventory_ledger
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_balance();