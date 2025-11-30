-- Create test table for connection testing
CREATE TABLE IF NOT EXISTS test_connection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE test_connection ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (insert and select)
CREATE POLICY "Allow public access" ON test_connection
  FOR ALL USING (true);

-- Insert a test record
INSERT INTO test_connection (name, message) VALUES 
('Family Proj', 'Testing Supabase connection - Success!');
