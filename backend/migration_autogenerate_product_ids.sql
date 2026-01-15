-- Migration: Auto-generate product IDs
-- This adds a trigger to auto-generate slug-style IDs for products

-- Trigger function to auto-generate product ID before insert if not provided
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

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS set_product_id_on_insert ON products;

CREATE TRIGGER set_product_id_on_insert
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_id();

-- Test the function (optional - you can run this to verify it works)
-- SELECT generate_product_id() FROM (SELECT 'Test Product' as name) AS NEW;
