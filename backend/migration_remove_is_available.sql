-- Migration: Remove is_available column from product_variants
-- This column is redundant - we only need products.is_active and product_variants.stock_quantity

-- Remove the is_available column
ALTER TABLE product_variants
DROP COLUMN IF EXISTS is_available;

-- Update the RLS policy to only check stock quantity
DROP POLICY IF EXISTS "Allow public read access to variants" ON product_variants;

CREATE POLICY "Allow public read access to variants"
    ON product_variants FOR SELECT
    TO anon, authenticated
    USING (stock_quantity >= 0);  -- Changed from is_available = true

-- Reload schema cache to fix the error
NOTIFY pgrst, 'reload schema';
