/*
  # Create inventory management system tables

  1. New Tables
    - `brands`: Store product brands
    - `locations`: Store inventory locations
    - `items`: Main inventory items table
    - `stock_updates`: Track inventory changes
    - `orders`: Purchase orders tracking

  2. Relationships
    - Items belong to categories, brands, and locations
    - Stock updates reference items
    - Orders reference items

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by authenticated users"
  ON brands FOR SELECT
  TO authenticated
  USING (true);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by authenticated users"
  ON locations FOR SELECT
  TO authenticated
  USING (true);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_num text UNIQUE NOT NULL,
  name text NOT NULL,
  category_id uuid REFERENCES categories(id),
  brand_id uuid REFERENCES brands(id),
  location_id uuid REFERENCES locations(id),
  qty_in_stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  lot_num text,
  expiry_date date,
  pack_size integer,
  reorder_level integer DEFAULT 0,
  remarks text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items are viewable by authenticated users"
  ON items FOR SELECT
  TO authenticated
  USING (true);

-- Create stock_updates table
CREATE TABLE IF NOT EXISTS stock_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) NOT NULL,
  qty_change integer NOT NULL,
  update_type text NOT NULL CHECK (update_type IN ('received', 'shipped', 'adjusted')),
  update_date timestamptz DEFAULT now(),
  remarks text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE stock_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock updates are viewable by authenticated users"
  ON stock_updates FOR SELECT
  TO authenticated
  USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) NOT NULL,
  qty_ordered integer NOT NULL,
  order_placed_date timestamptz DEFAULT now(),
  order_received_date timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_brand ON items(brand_id);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_updates_item ON stock_updates(item_id);
CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_id);

-- Add triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();