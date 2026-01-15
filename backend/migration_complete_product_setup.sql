-- COMPLETE MIGRATION: Product type, colour, auto-generated IDs and SKUs
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- PART 1: Add product_type and colour columns
-- ============================================
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS colour TEXT;

-- ============================================
-- PART 2: Remove redundant is_available column
-- ============================================
-- Drop the policy FIRST (it depends on the column)
DROP POLICY IF EXISTS "Allow public read access to variants" ON product_variants;

-- Now we can drop the column
ALTER TABLE product_variants
DROP COLUMN IF EXISTS is_available;

-- Recreate the policy without is_available
CREATE POLICY "Allow public read access to variants"
    ON product_variants FOR SELECT
    TO anon, authenticated
    USING (stock_quantity >= 0);

-- ============================================
-- PART 3: Auto-generate product IDs (slug-style)
-- ============================================
CREATE OR REPLACE FUNCTION trigger_generate_product_id()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    random_suffix TEXT;
    new_id TEXT;
    counter INT := 0;
BEGIN
    -- Only generate ID if not provided
    IF NEW.id IS NULL OR NEW.id = '' THEN
        -- Generate random 6-character suffix
        random_suffix := LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

        -- If we have a product name, create slug from it
        IF NEW.name IS NOT NULL AND NEW.name != '' THEN
            -- Create slug from product name
            base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
            base_slug := TRIM(BOTH '-' FROM base_slug);
            new_id := base_slug || '-' || random_suffix;
        ELSE
            -- Fallback to generic ID
            new_id := 'product-' || random_suffix;
        END IF;

        -- Ensure uniqueness (very unlikely to collide, but just in case)
        WHILE EXISTS (SELECT 1 FROM products WHERE id = new_id) AND counter < 10 LOOP
            random_suffix := LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
            new_id := base_slug || '-' || random_suffix;
            counter := counter + 1;
        END LOOP;

        NEW.id := new_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for product ID generation
DROP TRIGGER IF EXISTS set_product_id_on_insert ON products;

CREATE TRIGGER set_product_id_on_insert
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_id();

-- ============================================
-- PART 4: Auto-generate SKUs (PLAGUED-TYPE-COLOUR-SIZE)
-- ============================================
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

-- Create trigger for SKU generation
DROP TRIGGER IF EXISTS set_product_variant_sku_on_insert ON product_variants;

CREATE TRIGGER set_product_variant_sku_on_insert
    BEFORE INSERT ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_sku();

-- ============================================
-- PART 5: Update existing products with type and colour
-- ============================================
UPDATE products SET product_type = 'T-Shirt', colour = 'Black' WHERE id = 'plagued-tshirt-black';
UPDATE products SET product_type = 'Long Sleeve', colour = 'Black' WHERE id = 'plagued-longsleeve-black';
UPDATE products SET product_type = 'Cap', colour = 'Camo' WHERE id = 'plagued-cap-camo';

-- ============================================
-- PART 6: CRITICAL - Reload schema cache
-- ============================================
NOTIFY pgrst, 'reload schema';
