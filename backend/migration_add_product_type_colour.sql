-- Migration: Add product_type and colour columns, auto-generate SKUs
-- Run this in Supabase SQL Editor

-- Step 1: Add product_type and colour to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS colour TEXT;

-- Step 2: Create function to generate SKU from product info
CREATE OR REPLACE FUNCTION trigger_generate_product_sku()
RETURNS TRIGGER AS $$
DECLARE
    product_type_code TEXT;
    colour_code TEXT;
    size_code TEXT;
    generated_sku TEXT;
BEGIN
    -- Only generate SKU if not provided
    IF NEW.sku IS NULL OR NEW.sku = '' THEN
        -- Get product type and colour from the products table
        SELECT
            CASE
                WHEN product_type ILIKE '%t-shirt%' OR product_type ILIKE '%tshirt%' THEN 'TS'
                WHEN product_type ILIKE '%hoodie%' THEN 'HD'
                WHEN product_type ILIKE '%longsleeve%' OR product_type ILIKE '%long sleeve%' THEN 'LS'
                WHEN product_type ILIKE '%cap%' OR product_type ILIKE '%hat%' THEN 'CAP'
                WHEN product_type ILIKE '%jacket%' THEN 'JKT'
                WHEN product_type ILIKE '%sweatshirt%' OR product_type ILIKE '%sweater%' THEN 'SW'
                ELSE UPPER(SUBSTRING(product_type FROM 1 FOR 3))
            END,
            CASE
                WHEN colour ILIKE '%black%' THEN 'BLK'
                WHEN colour ILIKE '%white%' THEN 'WHT'
                WHEN colour ILIKE '%grey%' OR colour ILIKE '%gray%' THEN 'GRY'
                WHEN colour ILIKE '%red%' THEN 'RED'
                WHEN colour ILIKE '%blue%' THEN 'BLU'
                WHEN colour ILIKE '%green%' THEN 'GRN'
                WHEN colour ILIKE '%camo%' OR colour ILIKE '%camouflage%' THEN 'CAMO'
                WHEN colour ILIKE '%orange%' THEN 'ORG'
                ELSE UPPER(SUBSTRING(colour FROM 1 FOR 3))
            END
        INTO product_type_code, colour_code
        FROM products
        WHERE id = NEW.product_id;

        -- Get size code (handle "One Size" case)
        IF NEW.size ILIKE 'one size' THEN
            size_code := 'OS';
        ELSE
            size_code := UPPER(NEW.size);
        END IF;

        -- Generate SKU: PLAGUED-<TYPE>-<COLOUR>-<SIZE>
        generated_sku := 'PLAGUED-' ||
                        COALESCE(product_type_code, 'PRD') || '-' ||
                        COALESCE(colour_code, 'CLR') || '-' ||
                        size_code;

        NEW.sku := generated_sku;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Drop and recreate trigger for SKU generation
DROP TRIGGER IF EXISTS set_product_variant_sku_on_insert ON product_variants;

CREATE TRIGGER set_product_variant_sku_on_insert
    BEFORE INSERT ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_sku();

-- Step 4: Update existing products with product_type and colour (optional - for existing data)
-- You can customize these or remove if not needed
UPDATE products SET product_type = 'T-Shirt', colour = 'Black' WHERE id = 'plagued-tshirt-black';
UPDATE products SET product_type = 'Long Sleeve', colour = 'Black' WHERE id = 'plagued-longsleeve-black';
UPDATE products SET product_type = 'Cap', colour = 'Camo' WHERE id = 'plagued-cap-camo';

-- Step 5: IMPORTANT - Reload the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
