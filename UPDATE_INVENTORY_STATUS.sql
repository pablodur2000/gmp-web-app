-- Update Inventory Status System
-- Run this in your Supabase SQL Editor

-- 1. First, let's see current data (optional - for reference)
-- SELECT DISTINCT inventory_status FROM products;

-- 2. Update existing products to new status system
-- Map old statuses to new ones
UPDATE products SET inventory_status = 'disponible_pieza_unica' 
WHERE inventory_status = 'pieza_unica';

UPDATE products SET inventory_status = 'disponible_encargo_mismo_material' 
WHERE inventory_status = 'por_encargue_con_stock';

UPDATE products SET inventory_status = 'disponible_encargo_diferente_material' 
WHERE inventory_status = 'por_encargue_sin_stock';

UPDATE products SET inventory_status = 'no_disponible' 
WHERE inventory_status = 'sin_stock';

-- Keep 'en_stock' as 'disponible_pieza_unica' if it exists
UPDATE products SET inventory_status = 'disponible_pieza_unica' 
WHERE inventory_status = 'en_stock';

-- 3. Drop the old constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS check_inventory_status;

-- 4. Add new constraint with updated status values
ALTER TABLE products ADD CONSTRAINT check_inventory_status 
CHECK (inventory_status IN (
  'disponible_pieza_unica',
  'disponible_encargo_mismo_material', 
  'disponible_encargo_diferente_material',
  'no_disponible'
));

-- 5. Update the default value
ALTER TABLE products ALTER COLUMN inventory_status SET DEFAULT 'disponible_pieza_unica';

-- 6. Verify the changes
SELECT inventory_status, COUNT(*) as count 
FROM products 
GROUP BY inventory_status 
ORDER BY inventory_status;

-- 7. Check if any products have invalid status
SELECT * FROM products 
WHERE inventory_status NOT IN (
  'disponible_pieza_unica',
  'disponible_encargo_mismo_material', 
  'disponible_encargo_diferente_material',
  'no_disponible'
);
