-- Update order status constraint to use new simplified statuses
-- Old: pending, processing, shipped, delivered, cancelled
-- New: paid, shipped, delivered, cancelled, refunded

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with updated statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('paid', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Update any existing orders with old statuses to new statuses
-- pending -> paid (assuming pending orders were paid)
-- processing -> paid (processing means payment was received, just not shipped yet)
UPDATE orders SET status = 'paid' WHERE status = 'pending';
UPDATE orders SET status = 'paid' WHERE status = 'processing';

-- Note: shipped, delivered, and cancelled remain the same
