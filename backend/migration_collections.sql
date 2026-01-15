-- Migration: Create collections tables
-- Collections allow grouping products for coordinated releases/drops

-- 1. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_dropped BOOLEAN DEFAULT false,
    dropped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COLLECTION_PRODUCTS JUNCTION TABLE (many-to-many)
CREATE TABLE IF NOT EXISTS collection_products (
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (collection_id, product_id)
);

-- 3. INDEXES
CREATE INDEX idx_collections_dropped ON collections(is_dropped);
CREATE INDEX idx_collection_products_collection ON collection_products(collection_id);
CREATE INDEX idx_collection_products_product ON collection_products(product_id);

-- 4. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_collections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_collections_updated_at();

-- 5. RLS POLICIES (Enable RLS for security)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

-- Allow service role to do anything (for admin backend)
CREATE POLICY "Service role has full access to collections"
    ON collections
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role has full access to collection_products"
    ON collection_products
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Public can view dropped collections (optional, for future use)
CREATE POLICY "Public can view dropped collections"
    ON collections
    FOR SELECT
    TO anon, authenticated
    USING (is_dropped = true);
