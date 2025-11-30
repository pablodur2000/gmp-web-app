-- Supabase Admin Authentication Setup
-- Run this in your Supabase SQL Editor

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for admin users
CREATE POLICY "Admin users can read own data" ON admin_users
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = admin_users.email
  ));

-- 4. Insert your admin user (REPLACE WITH YOUR EMAIL)
INSERT INTO admin_users (email) VALUES ('your-admin-email@example.com')
ON CONFLICT (email) DO NOTHING;

-- 5. Verify the setup
SELECT * FROM admin_users;
