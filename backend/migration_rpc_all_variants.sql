-- Create RPC functions to completely bypass PostgREST for product_variants

-- Get all variants (for admin product list)
CREATE OR REPLACE FUNCTION get_all_product_variants()
RETURNS TABLE (
    id UUID,
    product_id TEXT,
    size TEXT,
    stock_quantity INTEGER,
    price_adjustment INTEGER,
    sku TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.id,
        pv.product_id,
        pv.size,
        pv.stock_quantity,
        pv.price_adjustment,
        pv.sku,
        pv.created_at,
        pv.updated_at
    FROM product_variants pv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get low stock variants
CREATE OR REPLACE FUNCTION get_low_stock_variants(threshold INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    product_id TEXT,
    size TEXT,
    stock_quantity INTEGER,
    price_adjustment INTEGER,
    sku TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    product_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.id,
        pv.product_id,
        pv.size,
        pv.stock_quantity,
        pv.price_adjustment,
        pv.sku,
        pv.created_at,
        pv.updated_at,
        p.name as product_name
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.stock_quantity < threshold AND pv.stock_quantity > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get variant stock for update
CREATE OR REPLACE FUNCTION get_variant_stock(variant_id_param UUID)
RETURNS TABLE (
    stock_quantity INTEGER,
    product_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.stock_quantity,
        pv.product_id
    FROM product_variants pv
    WHERE pv.id = variant_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert product variant
CREATE OR REPLACE FUNCTION insert_product_variant(
    p_product_id TEXT,
    p_size TEXT,
    p_price_adjustment INTEGER DEFAULT 0,
    p_stock_quantity INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    product_id TEXT,
    size TEXT,
    stock_quantity INTEGER,
    price_adjustment INTEGER,
    sku TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO product_variants (product_id, size, price_adjustment, stock_quantity)
    VALUES (p_product_id, p_size, p_price_adjustment, p_stock_quantity)
    RETURNING
        product_variants.id,
        product_variants.product_id,
        product_variants.size,
        product_variants.stock_quantity,
        product_variants.price_adjustment,
        product_variants.sku,
        product_variants.created_at,
        product_variants.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
