    -- Products table for V1 MVP
    -- This is the master catalog of all sellable products

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        barcode TEXT UNIQUE,
        unit TEXT NOT NULL CHECK (unit IN ('piece', 'kg', 'liter', 'gram', 'pack')),
        mrp NUMERIC(10,2) CHECK (mrp >= 0),
        selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
        tax_rate NUMERIC(5,2) DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
        created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

    -- Comments for documentation
    COMMENT ON TABLE products IS 'Master product catalog. Products are never deleted, only marked inactive if needed.';
    COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique identifier for the product';
    COMMENT ON COLUMN products.barcode IS 'Barcode for scanning. Can be auto-generated if not provided.';
    COMMENT ON COLUMN products.unit IS 'Unit of measurement for this product';
    COMMENT ON COLUMN products.selling_price IS 'Current selling price per unit';
    COMMENT ON COLUMN products.tax_rate IS 'Tax rate percentage (0-100)';
