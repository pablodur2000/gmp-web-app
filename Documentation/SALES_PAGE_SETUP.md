# 📋 Sales Page Setup Guide

## ✅ What Was Implemented

### 1. **Mutual Exclusivity Between Views**
- When "Gestionar Productos" is active, "Ver Ventas" is automatically deselected
- When "Ver Ventas" is active, "Gestionar Productos" is automatically deselected
- Only one view can be active at a time for better UX

### 2. **Quick Sale Form**
A beautiful, intuitive form at the top of the sales view with:
- **Product Selection**: Dropdown with all available products (shows title and price)
- **Quantity**: Number input (minimum 1)
- **Customer Name**: Text input (required)
- **Notes**: Optional text input for additional information
- **Live Total Preview**: Shows calculated total (price × quantity)
- **Add Button**: Creates the sale and refreshes the list

### 3. **Redesigned Sales List**
- **Clear Card Layout**: Each sale in its own card with better spacing
- **Status Indicators**: Color-coded dots and badges
- **Organized Information**: Grid layout showing email, phone, date, and total
- **Status Dropdown**: Easy status updates directly from the list
- **Notes Display**: Shows notes in a highlighted box when present
- **Empty State**: Friendly message when no sales exist

### 4. **Database Setup File**
Created `SALES_DATABASE_SETUP.sql` with:
- `sales_items` table for linking products to sales
- Automatic total calculation
- Triggers to keep totals in sync
- Proper indexes for performance

---

## 🗄️ Database Setup Instructions

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Sales Database Setup
1. Open the file: `Documentation/SALES_DATABASE_SETUP.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify the Setup
After running, you should see:
- ✅ `sales_items` table created
- ✅ RLS policies enabled
- ✅ Indexes created
- ✅ Trigger function created

### Step 4: Test the Setup (Optional)
You can test by running:
```sql
-- Check if table exists
SELECT * FROM sales_items LIMIT 1;

-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_sale_total';
```

---

## 📊 Current Database Schema

### Sales Table (Already Exists)
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sales Items Table (NEW - Run Setup SQL)
```sql
CREATE TABLE sales_items (
  id UUID PRIMARY KEY,
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 How to Use

### Creating a Quick Sale
1. Click **"Ver Ventas"** in Quick Actions
2. Fill out the Quick Sale Form:
   - Select a product from dropdown
   - Enter quantity
   - Enter customer name (required)
   - Add notes (optional)
3. Review the total preview
4. Click **"Agregar Venta"**
5. The sale appears in the list below

### Managing Sales
- **Change Status**: Use the dropdown in each sale card
- **Search**: Use the search bar to find sales by customer name
- **View Details**: All sale information is displayed in the card

---

## 🔄 Future Enhancements (Optional)

### Phase 1: Multiple Products per Sale
Currently, the quick form creates one product per sale. To support multiple products:
1. The `sales_items` table is already set up
2. Modify `createQuickSale` to create sale_items entries
3. Add UI to add multiple products before submitting

### Phase 2: Edit Sales
- Add edit button to each sale card
- Create edit modal similar to product edit form
- Allow adding/removing products from existing sales

### Phase 3: Sales Reports
- Total sales by date range
- Best selling products
- Revenue statistics

---

## 📝 Notes

- **Current Implementation**: Creates sales directly in the `sales` table with total_amount
- **Future Ready**: Database structure supports `sales_items` for multiple products per sale
- **Activity Logging**: All sales are logged in the activity feed
- **Status Management**: Status changes are tracked and logged

---

## ⚠️ Important

Before using the sales page in production:
1. ✅ Run the database setup SQL
2. ✅ Test creating a sale
3. ✅ Verify the total calculation works
4. ✅ Check activity logs are being created

---

**Status**: ✅ Ready to use after database setup!

