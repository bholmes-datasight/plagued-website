-- Create RPC functions to bypass PostgREST schema cache issues

-- Function to insert product variant
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
