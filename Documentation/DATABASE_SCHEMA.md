# Database Schema Documentation - Artesanías en Cuero

## Overview
This document provides the complete database schema for the leather crafts catalog application, including all tables, relationships, indexes, and RLS policies. The database is built on Supabase (PostgreSQL) with comprehensive security and performance optimizations.

## Database Setup

### Prerequisites
- Supabase project created
- Database access credentials
- SQL Editor access in Supabase Dashboard

### Connection Details
- **Project URL**: `https://diettnllnvkniouldfdu.supabase.co`
- **Database**: PostgreSQL 15
- **Extensions**: Enabled by default in Supabase

---

## 🗄️ Core Tables

### 1. Categories Table
```sql
-- Create categories table for product organization
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Billeteras', 'Billeteras y portamonedas elegantes'),
  ('Cinturones', 'Cinturones de cuero artesanales'),
  ('Bolsos', 'Bolsos y carteras únicas'),
  ('Accesorios', 'Accesorios varios en cuero')
ON CONFLICT (name) DO NOTHING;
```

### 2. Products Table
```sql
-- Create products table with all necessary fields
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(300),
  price INTEGER NOT NULL, -- Price in UYU (whole numbers, no cents)
  category_id UUID REFERENCES categories(id),
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  inventory_status VARCHAR(50) DEFAULT 'en_stock' CHECK (inventory_status IN ('en_stock', 'por_encargue_con_stock', 'por_encargue_sin_stock', 'sin_stock', 'pieza_unica')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users full access" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_inventory_status ON products(inventory_status);
CREATE INDEX idx_products_created_at ON products(created_at);
```

### **Migration Script for Existing Products**
```sql
-- Add inventory_status column to existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_status VARCHAR(50) DEFAULT 'en_stock';

-- Add check constraint for inventory_status
ALTER TABLE products ADD CONSTRAINT check_inventory_status 
CHECK (inventory_status IN ('en_stock', 'por_encargue_con_stock', 'por_encargue_sin_stock', 'sin_stock'));

-- Create index for inventory_status
CREATE INDEX IF NOT EXISTS idx_products_inventory_status ON products(inventory_status);

-- Update existing products to have proper inventory status
UPDATE products SET inventory_status = 'en_stock' WHERE inventory_status IS NULL;
```

### 3. Sales Table
```sql
-- Create unified sales table for tracking orders and sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Customer information
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  
  -- Sale details
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  total_amount INTEGER NOT NULL, -- Amount in UYU (whole numbers, no cents)
  payment_method VARCHAR(100),
  shipping_method VARCHAR(100) DEFAULT 'DAC',
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
  sold BOOLEAN DEFAULT false, -- Easy toggle in dashboard
  
  -- Additional info
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users full access" ON sales FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_sales_customer ON sales(customer_name);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_sold ON sales(sold);
CREATE INDEX idx_sales_created_at ON sales(created_at);

-- Insert sample data
INSERT INTO sales (customer_name, customer_email, total_amount, status, sold) 
VALUES 
  ('Cliente Ejemplo', 'cliente@ejemplo.com', 500, 'pendiente', false),
  ('Cliente Vendido', 'vendido@ejemplo.com', 750, 'completado', true),
  ('Cliente en Proceso', 'proceso@ejemplo.com', 600, 'en_proceso', false)
ON CONFLICT DO NOTHING;
```

### 4. Admin Users Table
```sql
-- Create admin_users table for role-based access control
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all access to admin_users" ON admin_users FOR ALL USING (true);

-- Insert admin user (replace with actual email)
INSERT INTO admin_users (email) VALUES ('your-admin-email@example.com');
```

### 5. Activity Logs Table
```sql
-- Create comprehensive activity logging table
CREATE TABLE IF NOT EXISTS activity_logs (
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

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Performance indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_resource_type ON activity_logs(resource_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Sample activity log
INSERT INTO activity_logs (user_email, action_type, resource_type, resource_name, details) VALUES
  ('admin@example.com', 'CREATE', 'PRODUCT', 'Test Product', '{"price": 45000, "category": "Billeteras"}');
```

### 6. Test Connection Table
```sql
-- Create test connection table for database connectivity testing
CREATE TABLE IF NOT EXISTS test_connection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE test_connection ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public access" ON test_connection FOR ALL USING (true);

-- Sample data
INSERT INTO test_connection (name, message) VALUES ('Family Proj', 'Testing Supabase connection - Success!');
```

---

## 🖼️ Storage Configuration

### Images Bucket Setup
```sql
-- Create storage bucket for product images
-- Note: This is done through Supabase Dashboard > Storage

-- RLS Policies for storage.objects
-- Delete existing policies first
DELETE FROM storage.policies WHERE bucket_id = 'images';

-- Create new policies
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

---

## 🔗 Table Relationships

### Entity Relationship Diagram
```
categories (1) ←→ (many) products
products (many) ←→ (many) sales (through order_items if needed)
admin_users (1) ←→ (many) activity_logs
auth.users (1) ←→ (many) activity_logs
```

### Foreign Key Constraints
- `products.category_id` → `categories.id`
- `activity_logs.user_id` → `auth.users.id`
- `sales` (standalone table for simplicity)

---

## 📊 Database Indexes

### Performance Optimization
All tables include strategic indexes for optimal query performance:

- **Primary Keys**: UUID with gen_random_uuid() for uniqueness
- **Foreign Keys**: Indexed for fast joins
- **Status Fields**: Indexed for filtering
- **Date Fields**: Indexed for sorting and time-based queries
- **Search Fields**: Indexed for customer name searches

### Index Strategy
```sql
-- Example of index usage
CREATE INDEX idx_sales_status_sold ON sales(status, sold);
CREATE INDEX idx_products_category_available ON products(category_id, available);
```

---

## 🔒 Security Features

### Row Level Security (RLS)
- **Public Tables**: `categories`, `products` (read-only)
- **Admin Tables**: `sales`, `admin_users`, `activity_logs`
- **Storage**: Public read, authenticated write

### Authentication Requirements
- **Public Access**: Product browsing, category viewing
- **Admin Access**: Product management, sales tracking, activity logging
- **Session Management**: JWT tokens via Supabase Auth

---

## 🚀 Database Initialization

### Complete Setup Script
```sql
-- Run this script in Supabase SQL Editor to set up the entire database

-- 1. Create all tables
-- (Run the CREATE TABLE statements above)

-- 2. Enable RLS on all tables
-- (Run the ALTER TABLE statements above)

-- 3. Create all policies
-- (Run the CREATE POLICY statements above)

-- 4. Create all indexes
-- (Run the CREATE INDEX statements above)

-- 5. Insert sample data
-- (Run the INSERT statements above)

-- 6. Verify setup
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 📈 Performance Monitoring

### Query Performance
Monitor slow queries and optimize as needed:

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 🔧 Maintenance

### Regular Tasks
1. **Monitor Performance**: Check query execution times
2. **Update Statistics**: Run ANALYZE on tables
3. **Clean Old Logs**: Archive old activity logs
4. **Backup Data**: Ensure regular backups via Supabase

### Backup Strategy
- **Automatic**: Supabase handles daily backups
- **Manual**: Export data via Supabase Dashboard
- **Point-in-time**: Available for disaster recovery

---

## 📚 Additional Resources

### Supabase Documentation
- [Database Management](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Management](https://supabase.com/docs/guides/storage)

### PostgreSQL Resources
- [Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)

---

## 📅 Last Updated
**Date**: January 2024  
**Version**: 2.0.0  
**Status**: Production Ready
