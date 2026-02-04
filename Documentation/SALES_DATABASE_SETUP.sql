-- ============================================
-- SALES DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create sales_items table (if it doesn't exist)
-- This table links products to sales with quantities
CREATE TABLE IF NOT EXISTS sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- Price at time of sale (in case product price changes)
  subtotal INTEGER NOT NULL, -- quantity * unit_price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique product per sale (or allow multiple? - we'll allow multiple for flexibility)
  UNIQUE(sale_id, product_id, id) -- Allow same product multiple times in same sale
);

-- Step 2: Enable RLS on sales_items
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policy for sales_items
CREATE POLICY "Allow authenticated users full access" ON sales_items 
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id ON sales_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_product_id ON sales_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_created_at ON sales_items(created_at);

-- Step 5: Update sales table to make customer_name optional for quick sales
-- (If you want to allow anonymous sales, otherwise keep it required)
-- ALTER TABLE sales ALTER COLUMN customer_name DROP NOT NULL;

-- Step 6: Add a function to calculate total from sales_items
-- This will help us keep total_amount in sync
CREATE OR REPLACE FUNCTION calculate_sale_total(sale_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(subtotal), 0)::INTEGER
  FROM sales_items
  WHERE sale_id = sale_uuid;
$$ LANGUAGE SQL;

-- Step 7: Create a trigger to auto-update total_amount when sales_items change
CREATE OR REPLACE FUNCTION update_sale_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sales
  SET total_amount = calculate_sale_total(NEW.sale_id),
      updated_at = NOW()
  WHERE id = NEW.sale_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sale_total
  AFTER INSERT OR UPDATE OR DELETE ON sales_items
  FOR EACH ROW
  EXECUTE FUNCTION update_sale_total();

-- Step 8: Verify the setup
SELECT 
  'sales_items table created' as status,
  COUNT(*) as item_count
FROM sales_items;

-- ============================================
-- USAGE EXAMPLE:
-- ============================================
-- 1. Create a sale:
-- INSERT INTO sales (customer_name, customer_email, notes, status)
-- VALUES ('Cliente Test', 'test@example.com', 'Notas de prueba', 'pendiente')
-- RETURNING id;
--
-- 2. Add products to the sale:
-- INSERT INTO sales_items (sale_id, product_id, quantity, unit_price, subtotal)
-- VALUES 
--   ('sale-uuid-here', 'product-uuid-1', 2, 500, 1000),
--   ('sale-uuid-here', 'product-uuid-2', 1, 750, 750);
--
-- 3. The total_amount in sales will be automatically updated!

