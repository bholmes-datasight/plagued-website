-- ============================================
-- PLAGUED MERCH SYSTEM - CLEAN SCHEMA V2
-- ============================================
-- This is a clean rebuild without is_available column
-- Drop existing tables and rebuild from scratch

-- Drop all existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS stock_transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS trigger_generate_product_id() CASCADE;
DROP FUNCTION IF EXISTS trigger_generate_product_sku() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS insert_product_variant(TEXT, TEXT, INTEGER, INTEGER) CASCADE;

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    product_type TEXT,
    colour TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- ============================================
-- 2. PRODUCT_VARIANTS TABLE (NO is_available!)
-- ============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    price_adjustment INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(product_id, size),
    CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity);

-- ============================================
-- 3. CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);

-- ============================================
-- 4. ADDRESSES TABLE
-- ============================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'GB',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    shipping_address_id UUID REFERENCES addresses(id),

    status TEXT NOT NULL DEFAULT 'pending',

    subtotal_amount INTEGER NOT NULL,
    shipping_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'gbp',

    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    stripe_charge_id TEXT,

    confirmation_email_sent BOOLEAN DEFAULT false,
    confirmation_email_sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    processing_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_stripe_pi ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 6. ORDER_ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),

    product_name TEXT NOT NULL,
    product_size TEXT NOT NULL,
    product_image_url TEXT,

    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL,
    line_total INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(product_variant_id);

-- ============================================
-- 7. STOCK_TRANSACTIONS TABLE
-- ============================================
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID NOT NULL REFERENCES product_variants(id),
    order_id UUID REFERENCES orders(id),

    transaction_type TEXT NOT NULL,
    quantity_change INTEGER NOT NULL,
    stock_before INTEGER NOT NULL,
    stock_after INTEGER NOT NULL,

    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_transactions_variant ON stock_transactions(product_variant_id);
CREATE INDEX idx_stock_transactions_order ON stock_transactions(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;

-- Public read access for products (only active products)
CREATE POLICY "Allow public read access to products"
    ON products FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Public read access for variants (only with stock)
CREATE POLICY "Allow public read access to variants"
    ON product_variants FOR SELECT
    TO anon, authenticated
    USING (stock_quantity >= 0);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate product ID (slug-style)
CREATE OR REPLACE FUNCTION trigger_generate_product_id()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    random_suffix TEXT;
    new_id TEXT;
    counter INT := 0;
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        random_suffix := LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

        IF NEW.name IS NOT NULL AND NEW.name != '' THEN
            base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
            base_slug := TRIM(BOTH '-' FROM base_slug);
            new_id := base_slug || '-' || random_suffix;
        ELSE
            new_id := 'product-' || random_suffix;
        END IF;

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

CREATE TRIGGER set_product_id_on_insert
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_id();

-- Auto-generate SKU (PLAGUED-TYPE-COLOUR-SIZE)
CREATE OR REPLACE FUNCTION trigger_generate_product_sku()
RETURNS TRIGGER AS $$
DECLARE
    product_type_code TEXT;
    colour_code TEXT;
    size_code TEXT;
    generated_sku TEXT;
BEGIN
    IF NEW.sku IS NULL OR NEW.sku = '' THEN
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

        IF NEW.size ILIKE 'one size' THEN
            size_code := 'OS';
        ELSE
            size_code := UPPER(NEW.size);
        END IF;

        generated_sku := 'PLAGUED-' ||
                        COALESCE(product_type_code, 'PRD') || '-' ||
                        COALESCE(colour_code, 'CLR') || '-' ||
                        size_code;

        NEW.sku := generated_sku;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_product_variant_sku_on_insert
    BEFORE INSERT ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_product_sku();

-- Generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    date_part TEXT;
    random_part TEXT;
BEGIN
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    new_number := 'ORD-' || date_part || '-' || random_part;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- RPC function to insert product variant (bypasses PostgREST cache)
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

-- ============================================
-- SEED DATA
-- ============================================

-- Insert existing products
INSERT INTO products (id, name, description, base_price, product_type, colour, image_url, is_active) VALUES
('plagued-tshirt-black', 'Plagued Logo T-Shirt', 'Black t-shirt with white dripping Plagued logo on front.', 2000, 'T-Shirt', 'Black', '/merch/tshirt-black.JPG', true),
('plagued-longsleeve-black', 'Plagued Long Sleeve T-Shirt', 'Black long sleeve t-shirt with Plagued design.', 2500, 'Long Sleeve', 'Black', '/merch/longsleeve-black.JPG', true),
('plagued-cap-camo', 'Plagued Camo Cap', 'Camouflage cap with embroidered orange Plagued logo.', 1800, 'Cap', 'Camo', '/merch/cap-camo.png', true);

-- Insert product variants (SKUs will be auto-generated)
INSERT INTO product_variants (product_id, size, stock_quantity) VALUES
('plagued-tshirt-black', 'S', 10),
('plagued-tshirt-black', 'M', 15),
('plagued-tshirt-black', 'L', 20),
('plagued-tshirt-black', 'XL', 12),
('plagued-tshirt-black', 'XXL', 8),
('plagued-longsleeve-black', 'S', 8),
('plagued-longsleeve-black', 'M', 12),
('plagued-longsleeve-black', 'L', 15),
('plagued-longsleeve-black', 'XL', 10),
('plagued-longsleeve-black', 'XXL', 5),
('plagued-cap-camo', 'One Size', 25);

-- Force schema reload
NOTIFY pgrst, 'reload schema';
