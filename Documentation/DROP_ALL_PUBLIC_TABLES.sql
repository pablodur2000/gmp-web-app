-- Drop all public tables (develop). Run in Supabase SQL Editor before re-running bootstrap.
-- Order respects FKs.
DROP TABLE IF EXISTS "Testing connect" CASCADE;
DROP TABLE IF EXISTS test_connection CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS sales_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
