-- Migration Script for Adding 'pieza_unica' to Inventory Status
-- Run this in your Supabase SQL Editor

-- Update the check constraint to include 'pieza_unica'
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_inventory_status;
ALTER TABLE products ADD CONSTRAINT check_inventory_status 
CHECK (inventory_status IN ('en_stock', 'por_encargue_con_stock', 'por_encargue_sin_stock', 'sin_stock', 'pieza_unica'));

-- Update existing products if needed (optional)
-- UPDATE products SET inventory_status = 'en_stock' WHERE inventory_status IS NULL;

-- Verify the constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'products'::regclass 
AND contype = 'c' 
AND conname = 'check_inventory_status';

