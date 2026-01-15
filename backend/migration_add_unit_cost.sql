-- Migration: Add unit_cost to products table for profit tracking

-- Add unit_cost column (stored in pence like base_price)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS unit_cost INTEGER DEFAULT 0;

COMMENT ON COLUMN products.unit_cost IS 'Cost per unit in pence (for profit calculation)';

-- Update existing products to have a default unit cost of 0
UPDATE products SET unit_cost = 0 WHERE unit_cost IS NULL;
