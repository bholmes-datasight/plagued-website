-- ============================================
-- PLAGUED MERCH SYSTEM - SUPABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor after creating your project
-- This creates all tables, indexes, triggers, and seed data

-- ============================================
-- 1. PRODUCTS TABLE
-- Base product information
-- ============================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- ============================================
-- 2. PRODUCT_VARIANTS TABLE
-- Size-specific stock levels
-- ============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    price_adjustment INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(product_id, size),
    CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_available ON product_variants(is_available, stock_quantity);

-- ============================================
-- 3. CUSTOMERS TABLE
-- Guest customer information
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
-- Shipping addresses
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
-- Order header with status tracking
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
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_stripe_pi ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 6. ORDER_ITEMS TABLE
-- Individual line items in an order
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
-- Audit trail for stock changes
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

-- Public read access for products and variants
CREATE POLICY "Allow public read access to products"
    ON products FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Allow public read access to variants"
    ON product_variants FOR SELECT
    TO anon, authenticated
    USING (is_available = true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Trigger to update updated_at timestamp
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

-- Function to generate order numbers
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

-- ============================================
-- SEED DATA
-- Insert existing products and variants
-- ============================================

-- Insert products
INSERT INTO products (id, name, description, base_price, image_url, is_active) VALUES
('plagued-tshirt-black', 'Plagued Logo T-Shirt', 'Black t-shirt with white dripping Plagued logo on front.', 2000, '/merch/tshirt-black.JPG', true),
('plagued-longsleeve-black', 'Plagued Long Sleeve T-Shirt', 'Black long sleeve t-shirt with Plagued design.', 2500, '/merch/longsleeve-black.JPG', true),
('plagued-cap-camo', 'Plagued Camo Cap', 'Camouflage cap with embroidered orange Plagued logo.', 1800, '/merch/cap-camo.png', true);

-- Insert product variants with initial stock
-- Plagued T-Shirt Black
INSERT INTO product_variants (product_id, size, stock_quantity, sku, is_available) VALUES
('plagued-tshirt-black', 'S', 10, 'PLAGUED-TS-BLK-S', true),
('plagued-tshirt-black', 'M', 15, 'PLAGUED-TS-BLK-M', true),
('plagued-tshirt-black', 'L', 20, 'PLAGUED-TS-BLK-L', true),
('plagued-tshirt-black', 'XL', 12, 'PLAGUED-TS-BLK-XL', true),
('plagued-tshirt-black', 'XXL', 8, 'PLAGUED-TS-BLK-XXL', true);

-- Plagued Long Sleeve Black
INSERT INTO product_variants (product_id, size, stock_quantity, sku, is_available) VALUES
('plagued-longsleeve-black', 'S', 8, 'PLAGUED-LS-BLK-S', true),
('plagued-longsleeve-black', 'M', 12, 'PLAGUED-LS-BLK-M', true),
('plagued-longsleeve-black', 'L', 15, 'PLAGUED-LS-BLK-L', true),
('plagued-longsleeve-black', 'XL', 10, 'PLAGUED-LS-BLK-XL', true),
('plagued-longsleeve-black', 'XXL', 5, 'PLAGUED-LS-BLK-XXL', true);

-- Plagued Cap Camo (One Size)
INSERT INTO product_variants (product_id, size, stock_quantity, sku, is_available) VALUES
('plagued-cap-camo', 'One Size', 25, 'PLAGUED-CAP-CAMO', true);

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- ============================================

-- Check products
-- SELECT * FROM products;

-- Check variants with stock
-- SELECT p.name, pv.size, pv.stock_quantity, pv.sku
-- FROM products p
-- JOIN product_variants pv ON p.id = pv.product_id
-- ORDER BY p.name, pv.size;

-- Test order number generation
-- SELECT generate_order_number();
