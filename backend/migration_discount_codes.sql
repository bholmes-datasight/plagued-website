-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    single_use_per_customer BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discount_code_usage table to track which customers have used which codes
CREATE TABLE IF NOT EXISTS discount_code_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_code_id UUID REFERENCES discount_codes(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(discount_code_id, customer_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(active);
CREATE INDEX IF NOT EXISTS idx_discount_code_usage_email ON discount_code_usage(customer_email);
CREATE INDEX IF NOT EXISTS idx_discount_code_usage_code ON discount_code_usage(discount_code_id);

-- Insert the DOMINION10 test code
INSERT INTO discount_codes (code, discount_percentage, description, single_use_per_customer)
VALUES ('DOMINION10', 10, 'Mailing list sign-up discount - 10% off first order', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Add discount_code_id column to orders table to track which discount was used
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS discount_code_id UUID REFERENCES discount_codes(id) ON DELETE SET NULL;

-- Add index for orders discount lookup
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code_id);

-- Add RLS policies for discount_codes table
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active discount codes (needed for validation)
DROP POLICY IF EXISTS "Allow public read access to active discount codes" ON discount_codes;
CREATE POLICY "Allow public read access to active discount codes"
ON discount_codes FOR SELECT
USING (active = TRUE);

-- Allow service role full access to discount codes
DROP POLICY IF EXISTS "Allow service role full access to discount_codes" ON discount_codes;
CREATE POLICY "Allow service role full access to discount_codes"
ON discount_codes
TO service_role
USING (true)
WITH CHECK (true);

-- Add RLS policies for discount_code_usage table
ALTER TABLE discount_code_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to discount code usage
DROP POLICY IF EXISTS "Allow service role full access to discount_code_usage" ON discount_code_usage;
CREATE POLICY "Allow service role full access to discount_code_usage"
ON discount_code_usage
TO service_role
USING (true)
WITH CHECK (true);
