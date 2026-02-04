-- =============================================================================
-- GMP Web App - Develop database bootstrap (PROD schema)
-- For a CLEAN database only. Run the drop script below first if tables exist.
-- Table order: categories → products → sales → sales_items, etc.
-- =============================================================================

-- 1. Categories (PROD: includes main_category)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  main_category VARCHAR(50) DEFAULT 'cuero' CHECK (main_category IN ('cuero', 'macrame'))
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
INSERT INTO categories (name, description, main_category) VALUES
  ('Billeteras', 'Billeteras y portamonedas elegantes', 'cuero'),
  ('Cinturones', 'Cinturones de cuero artesanales', 'cuero'),
  ('Bolsos', 'Bolsos y carteras únicas', 'cuero'),
  ('Accesorios', 'Accesorios varios en cuero', 'cuero')
ON CONFLICT (name) DO NOTHING;

-- 2. Products (PROD: main_category + inventory_status enum)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(255),
  price INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id),
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  inventory_status VARCHAR(100) DEFAULT 'disponible_pieza_unica' CHECK (inventory_status IN (
    'disponible_pieza_unica',
    'disponible_encargo_mismo_material',
    'disponible_encargo_diferente_material',
    'no_disponible'
  )),
  main_category VARCHAR(50) DEFAULT 'cuero' CHECK (main_category IN ('cuero', 'macrame'))
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_inventory_status ON products(inventory_status);
CREATE INDEX IF NOT EXISTS idx_products_main_category ON products(main_category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- 3. Contact messages
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- 4. Sales (PROD: no delivery_date)
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(255),
  customer_address TEXT,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount INTEGER NOT NULL,
  payment_method VARCHAR(255),
  shipping_method VARCHAR(255) DEFAULT 'DAC',
  status VARCHAR(50) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
  sold BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access" ON sales FOR ALL USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_name);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_sold ON sales(sold);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- 5. Sales items (PROD; depends on sales + products)
CREATE TABLE sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES sales(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE sales_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users full access" ON sales_items FOR ALL USING (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_sales_items_sale_id ON sales_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_product_id ON sales_items(product_id);

-- 6. Admin users
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to admin_users" ON admin_users FOR ALL USING (true);
INSERT INTO admin_users (email) VALUES ('your-admin-email@example.com')
ON CONFLICT (email) DO NOTHING;

-- 7. Activity logs (references auth.users)
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_name TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON activity_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- 8. Test connection (for health checks)
CREATE TABLE test_connection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE test_connection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON test_connection FOR ALL USING (true);
INSERT INTO test_connection (name, message) VALUES ('GMP Develop', 'Develop DB connected.');

-- 9. "Testing connect" (PROD table; name has space)
CREATE TABLE "Testing connect" (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  test TEXT
);
ALTER TABLE "Testing connect" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON "Testing connect" FOR ALL USING (true);

-- Verify
SELECT 'Bootstrap complete. Tables:' AS status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
