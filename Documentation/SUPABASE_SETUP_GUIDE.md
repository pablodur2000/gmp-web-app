# Supabase Setup Guide - Artesanías en Cuero

## Prerequisites
- ✅ Supabase project already created
- ✅ React project with Supabase client configured
- ✅ Environment variables file ready

## Step 1: Get Your Supabase Credentials

### From Your Supabase Dashboard:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your existing project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (anon/public)
   - **Anon/Public Key** (anon/public)

## Step 2: Update Environment Variables

### Update `.env.local`:
```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_NAME=Artesanías en Cuero
VITE_APP_URL=http://localhost:5173
```

**Example:**
```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Tables

### Go to Supabase Dashboard → SQL Editor

### 1. Create Categories Table (Updated):
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);
```

### 2. Create Products Table:
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(300),
  price INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id),
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

### 3. Create Testimonials Table:
```sql
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON testimonials
  FOR SELECT USING (true);
```

## Step 4: Insert Sample Data

### Insert Categories:
```sql
INSERT INTO categories (name, description, product_count) VALUES
('Billeteras', 'Billeteras y portamonedas elegantes', 5),
('Cinturones', 'Cinturones de cuero artesanales', 3),
('Bolsos', 'Bolsos y carteras únicas', 4),
('Accesorios', 'Accesorios varios en cuero', 2);
```

### Insert Products:
```sql
INSERT INTO products (title, description, short_description, price, category_id, available, featured, images) VALUES
(
  'Billetera de Cuero Premium',
  'Billetera elegante hecha a mano con cuero genuino de primera calidad. Esta pieza única combina funcionalidad y estilo, con múltiples compartimentos para organizar tarjetas, billetes y monedas.',
  'Billetera elegante de cuero genuino',
  45000,
  (SELECT id FROM categories WHERE name = 'Billeteras'),
  true,
  true,
  ARRAY['https://f.fcdn.app/imgs/640e47/tienda.soysantander.com.uy/comp/6131/original/catalogo/BIGAIONAL_NAC41161005_1/1500-1500/billetera-de-cuero-garnie-nacional-oficial-negro.jpg']
),
(
  'Cinturón de Cuero Clásico',
  'Cinturón de cuero con hebilla de latón, perfecto para cualquier ocasión',
  'Cinturón clásico con hebilla de latón',
  35000,
  (SELECT id FROM categories WHERE name = 'Cinturones'),
  true,
  true,
  ARRAY['https://themountainatelier.com/cdn/shop/products/cinturon-hombre-miel-25-522838.jpg?v=1694638927']
),
(
  'Bolso de Mano Artesanal',
  'Bolso elegante y espacioso, ideal para el día a día',
  'Bolso elegante y espacioso',
  85000,
  (SELECT id FROM categories WHERE name = 'Bolsos'),
  true,
  true,
  ARRAY['https://naturalmenteartesania.com/wp-content/uploads/2020/04/IMG_6734-scaled.jpg']
);
```

### Insert Testimonials:
```sql
INSERT INTO testimonials (name, comment, rating, avatar) VALUES
(
  'María González',
  'La calidad del cuero es excepcional. Mi billetera se ve como nueva después de un año de uso.',
  5,
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
),
(
  'Carlos Rodríguez',
  'El cinturón que compré es perfecto. El trabajo artesanal se nota en cada detalle.',
  5,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
),
(
  'Ana Martínez',
  'Mi bolso es hermoso y muy resistente. Recibo muchos cumplidos cada vez que lo uso.',
  5,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
);
```

## Step 5: Update Product Counts

### Create a function to update product counts:
```sql
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories 
    SET product_count = product_count - 1 
    WHERE id = OLD.category_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.category_id != NEW.category_id THEN
      UPDATE categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
      UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_product_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();
```

## Step 6: Test Your Connection

### In your React app, test the connection:
```typescript
// In any component, test the connection
import { supabase } from '../lib/supabase'

// Test categories
const testCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Categories:', data)
  }
}

// Test products
const testProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Products:', data)
  }
}
```

## Step 7: Replace Mock Data

### Update your components to use Supabase instead of mock data:

1. **FeaturedProducts.tsx** - Replace mock data with Supabase queries
2. **CatalogPage.tsx** - Replace mock data with Supabase queries  
3. **ProductDetailPage.tsx** - Replace mock data with Supabase queries
4. **TestimonialsSection.tsx** - Replace mock data with Supabase queries

## Step 8: Storage Setup (Required for Product Images)

### Configure your `images` bucket:
1. Go to **Storage** in Supabase dashboard
2. Select your `images` bucket
3. Go to **Policies** tab
4. Add these policies:

```sql
-- Allow public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### Storage Bucket Configuration:
- **Bucket Name**: `images`
- **Public**: Yes (for read access)
- **File Size Limit**: 50MB
- **Allowed MIME Types**: image/*

## Troubleshooting

### Common Issues:
- **CORS errors**: Check your Supabase project settings
- **RLS errors**: Ensure policies are created correctly
- **Connection errors**: Verify environment variables
- **Type errors**: Check that your TypeScript types match table schemas

### Check Connection:
```typescript
// Test if Supabase is connected
const { data, error } = await supabase
  .from('categories')
  .select('count')
  .limit(1)

if (error) {
  console.error('Supabase connection failed:', error)
} else {
  console.log('Supabase connected successfully!')
}
```

## Next Steps

After completing this setup:
1. ✅ Test all database queries
2. ✅ Replace all mock data in components
3. ✅ Test CRUD operations
4. ✅ Set up image upload functionality
5. ✅ Implement user authentication
6. ✅ Add admin interface

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord Community**: [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
