# API Documentation - Artesanías en Cuero

## Overview
This document describes the API endpoints and data structures for the leather crafts catalog application. The API is built using Supabase as the backend service and now includes comprehensive product management (CRUD), sales management, and activity logging capabilities.

## Version
**v2.4.0** - Advanced Activity Search & Unified Search System

## Base URL
```
https://diettnllnvkniouldfdu.supabase.co
```

## Authentication
- **Admin endpoints** require authentication via Supabase Auth
- **Public endpoints** are accessible without authentication
- **JWT tokens** are automatically handled by Supabase client

---

## 🔐 Authentication Endpoints

### Admin Login
- **Endpoint**: `POST /auth/v1/token?grant_type=password`
- **Description**: Authenticate admin user
- **Auth**: Not required
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "user": {
      "id": "uuid",
      "email": "admin@example.com"
    }
  }
  ```

### Admin Logout
- **Endpoint**: `POST /auth/v1/logout`
- **Description**: Sign out admin user
- **Auth**: Required
- **Response**: `{ "message": "Logged out" }`

---

## 📦 Product Endpoints

### Get All Products
- **Endpoint**: `GET /rest/v1/products`
- **Description**: Retrieve all products with optional filtering
- **Auth**: Not required
- **Query Parameters**:
  - `category_id` (optional): Filter by category
  - `featured` (optional): Filter featured products
  - `available` (optional): Filter available products
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "title": "Billetera de Cuero Premium",
      "description": "Billetera elegante hecha a mano...",
      "short_description": "Billetera elegante de cuero genuino",
      "price": 450,
      "category_id": "uuid",
      "available": true,
      "featured": true,
      "images": ["url1", "url2"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00Z"
    }
  ]
  ```

### Get Product by ID
- **Endpoint**: `GET /rest/v1/products?id=eq.{id}`
- **Description**: Retrieve a specific product
- **Auth**: Not required
- **Response**: Single product object

### Create Product
- **Endpoint**: `POST /rest/v1/products`
- **Description**: Create a new product (Admin only)
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "Product Title",
    "description": "Full product description",
    "short_description": "Short description",
    "price": 450,
    "category_id": "uuid",
    "available": true,
    "featured": false,
    "images": ["image_url1", "image_url2"]
  }
  ```
- **Response**: Created product object

### Update Product ✅ IMPLEMENTED
- **Endpoint**: `PATCH /rest/v1/products?id=eq.{id}`
- **Description**: Update an existing product (Admin only)
- **Auth**: Required
- **Body**: Partial product object with fields to update
- **Response**: Updated product object
- **Features**:
  - Pre-populated form with existing data
  - Image management (add/remove existing images)
  - Form validation with error handling
  - Activity logging for audit trail

### Delete Product ✅ IMPLEMENTED
- **Endpoint**: `DELETE /rest/v1/products?id=eq.{id}`
- **Description**: Delete a product (Admin only)
- **Auth**: Required
- **Response**: `{ "message": "Product deleted" }`
- **Features**:
  - Confirmation modal with product details
  - Safe deletion process
  - Activity logging for audit trail
  - Automatic refresh of product list

---

## 🏷️ Category Endpoints

### Get All Categories
- **Endpoint**: `GET /rest/v1/categories`
- **Description**: Retrieve all product categories
- **Auth**: Not required
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "name": "Billeteras",
      "description": "Billeteras y portamonedas elegantes",
      "image": "category_image_url",
      "product_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```

### Get Category by ID
- **Endpoint**: `GET /rest/v1/categories?id=eq.{id}`
- **Description**: Retrieve a specific category
- **Auth**: Not required

---

## 💰 Sales Management Endpoints

### Get All Sales
- **Endpoint**: `GET /rest/v1/sales`
- **Description**: Retrieve all sales/orders with optional filtering
- **Auth**: Required (Admin only)
- **Query Parameters**:
  - `status` (optional): Filter by status (pendiente, en_proceso, completado, cancelado)
  - `sold` (optional): Filter by sold status (true/false)
  - `customer_name` (optional): Filter by customer name
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "customer_name": "Cliente Ejemplo",
      "customer_email": "cliente@ejemplo.com",
      "customer_phone": "+598 123 456 789",
      "customer_address": "Dirección del cliente",
      "sale_date": "2024-01-01",
      "delivery_date": "2024-01-05",
      "total_amount": 500,
      "payment_method": "Efectivo",
      "shipping_method": "DAC",
      "status": "pendiente",
      "sold": false,
      "notes": "Notas adicionales",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```

### Get Sale by ID
- **Endpoint**: `GET /rest/v1/sales?id=eq.{id}`
- **Description**: Retrieve a specific sale
- **Auth**: Required (Admin only)
- **Response**: Single sale object

### Create Sale
- **Endpoint**: `POST /rest/v1/sales`
- **Description**: Create a new sale/order (Admin only)
- **Auth**: Required
- **Body**:
  ```json
  {
    "customer_name": "Customer Name",
    "customer_email": "customer@email.com",
    "customer_phone": "+598 123 456 789",
    "customer_address": "Customer Address",
    "sale_date": "2024-01-01",
    "delivery_date": "2024-01-05",
    "total_amount": 50000,
    "payment_method": "Efectivo",
    "shipping_method": "DAC",
    "status": "pendiente",
    "sold": false,
    "notes": "Additional notes"
  }
  ```
- **Response**: Created sale object

### Update Sale Status
- **Endpoint**: `PATCH /rest/v1/sales?id=eq.{id}`
- **Description**: Update sale workflow status (Admin only)
- **Auth**: Required
- **Body**:
  ```json
  {
    "status": "completado"
  }
  ```
- **Response**: Updated sale object
- **Workflow Control**: 
  - Status options: `pendiente`, `en_proceso`, `completado`, `cancelado`
  - `sold` field automatically updates based on status
  - `completado` status sets `sold: true`

### Delete Sale
- **Endpoint**: `DELETE /rest/v1/sales?id=eq.{id}`
- **Description**: Delete a sale (Admin only)
- **Auth**: Required
- **Response**: `{ "message": "Sale deleted" }`

---

## 📊 Activity Logging Endpoints

### Get Activity Logs
- **Endpoint**: `GET /rest/v1/activity_logs`
- **Description**: Retrieve admin activity logs
- **Auth**: Required (Admin only)
- **Query Parameters**:
  - `user_id` (optional): Filter by user ID
  - `action_type` (optional): Filter by action (CREATE, UPDATE, DELETE)
  - `resource_type` (optional): Filter by resource type
  - `limit` (optional): Limit results (default: 10)
- **Response**:

### Search Activity Logs ✅ NEW
- **Endpoint**: `GET /rest/v1/activity_logs`
- **Description**: Advanced search with backend filtering
- **Auth**: Required (Admin only)
- **Search Capabilities**:
  - **Text Search**: Resource name and user email (OR search)
  - **Action Filter**: Filter by CREATE, UPDATE, DELETE
  - **Combined Filtering**: Text + action type filtering
- **Query Logic**: 
  - `resource_name.ilike.%search_term%` OR `user_email.ilike.%search_term%`
  - `action_type = 'CREATE'|'UPDATE'|'DELETE'`
- **Response**: Filtered activity logs array
  ```json
  [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "admin@example.com",
      "action_type": "CREATE",
      "resource_type": "PRODUCT",
      "resource_id": "uuid",
      "resource_name": "Product Name",
      "details": {
        "price": 45000,
        "category": "Billeteras",
        "available": true
      },
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```

### Create Activity Log
- **Endpoint**: `POST /rest/v1/activity_logs`
- **Description**: Create new activity log entry (Admin only)
- **Auth**: Required
- **Body**:
  ```json
  {
    "user_id": "uuid",
    "user_email": "admin@example.com",
    "action_type": "CREATE",
    "resource_type": "PRODUCT",
    "resource_id": "uuid",
    "resource_name": "Product Name",
    "details": {
      "price": 450,
      "category": "Billeteras"
    }
  }
  ```
- **Response**: Created activity log object

---

## 🖼️ Storage Endpoints

### Upload Image
- **Endpoint**: `POST /storage/v1/object/upload`
- **Description**: Upload product images to storage bucket
- **Auth**: Required
- **Headers**:
  - `Authorization: Bearer {jwt_token}`
  - `Content-Type: multipart/form-data`
- **Body**: Form data with file
- **Response**:
  ```json
  {
    "path": "filename.jpg",
    "id": "uuid"
  }
  ```

### Get Image URL
- **Endpoint**: `GET /storage/v1/object/public/images/{filename}`
- **Description**: Get public URL for uploaded image
- **Auth**: Not required
- **Response**: Direct image file

---

## 📊 Admin Endpoints

### Get Admin Users
- **Endpoint**: `GET /rest/v1/admin_users`
- **Description**: Get list of admin users
- **Auth**: Required
- **Response**: Array of admin user objects

### Verify Admin Status
- **Endpoint**: `GET /rest/v1/admin_users?email=eq.{email}`
- **Description**: Check if user has admin privileges
- **Auth**: Required
- **Response**: Admin user object or empty array

---

## 🔒 Row Level Security (RLS) Policies

### Products Table
```sql
-- Public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Authenticated users full access (admin)
CREATE POLICY "Allow authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### Categories Table
```sql
-- Public read access
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);
```

### Sales Table
```sql
-- Authenticated users full access (admin only)
CREATE POLICY "Allow authenticated users full access" ON sales
  FOR ALL USING (auth.role() = 'authenticated');
```

### Activity Logs Table
```sql
-- Users can read own logs
CREATE POLICY "Users can read own logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create logs
CREATE POLICY "Users can create logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Storage Bucket
```sql
-- Public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Authenticated users can upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

---

## 📝 Data Models

### Product Schema
```typescript
interface Product {
  id: string;                    // UUID, auto-generated
  title: string;                 // Product title (required)
  description: string;           // Full description
  short_description: string;     // Short description (required)
  price: number;                 // Price in UYU (required)
  category_id: string;           // Reference to categories.id
  available: boolean;            // Product availability
  featured: boolean;             // Featured product flag
  images: string[];              // Array of image URLs
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

### Category Schema
```typescript
interface Category {
  id: string;                    // UUID, auto-generated
  name: string;                  // Category name (required, unique)
  description: string;           // Category description
  image: string;                 // Category image URL
  product_count: number;         // Number of products in category
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

### Sale Schema
```typescript
interface Sale {
  id: string;                    // UUID, auto-generated
  customer_name: string;         // Customer name (required)
  customer_email: string;        // Customer email
  customer_phone: string;        // Customer phone
  customer_address: string;      // Customer address
  sale_date: string;             // Sale date (required)
  delivery_date: string;         // Delivery date
  total_amount: number;          // Total amount in UYU (required)
  payment_method: string;        // Payment method
  shipping_method: string;       // Shipping method (default: 'DAC')
  status: SaleStatus;            // Sale status
  sold: boolean;                 // Sold flag (default: false)
  notes: string;                 // Additional notes
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}

type SaleStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
```

### Activity Log Schema
```typescript
interface ActivityLog {
  id: string;                    // UUID, auto-generated
  user_id: string;               // Reference to auth.users.id
  user_email: string;            // User email
  action_type: string;           // Action type (CREATE, UPDATE, DELETE)
  resource_type: string;         // Resource type (PRODUCT, SALE, etc.)
  resource_id: string;           // Resource ID
  resource_name: string;         // Resource name
  details: any;                  // Additional details (JSONB)
  ip_address: string;            // IP address
  user_agent: string;            // User agent string
  created_at: string;            // ISO timestamp
}
```

---

## 🚨 Error Handling

### Common Error Codes
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not found - Resource doesn't exist
- `422`: Validation error - Invalid data
- `500`: Internal server error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "hint": "Helpful hint for resolution"
}
```

---

## 🔧 Rate Limiting
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **File uploads**: 10 files per minute

---

## 📚 SDK Usage Examples

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Get all products
const { data, error } = await supabase
  .from('products')
  .select('*')

// Create product (admin only)
const { data, error } = await supabase
  .from('products')
  .insert([productData])
  .select()

// Get all sales (admin only)
const { data, error } = await supabase
  .from('sales')
  .select('*')
  .order('created_at', { ascending: false })

// Update sale status (admin only)
const { data, error } = await supabase
  .from('sales')
  .update({ sold: true, status: 'completado' })
  .eq('id', saleId)

// Get activity logs (admin only)
const { data, error } = await supabase
  .from('activity_logs')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)

// Upload image
const { data, error } = await supabase.storage
  .from('images')
  .upload(filename, file)
```

---

## 📖 Additional Resources
- [Supabase Documentation](https://supabase.com/docs)
- [React Supabase Client](https://supabase.com/docs/reference/javascript)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage-createbucket)

---

## 📅 Last Updated
**Date**: January 2024  
**Version**: 2.0.0  
**Status**: Active Development with Admin System
