/*
  # Fix RLS Policies
  
  1. Changes
    - Remove role-based security
    - Add simple RLS policies for all tables
    - Update function to work with RLS
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are manageable by admins and managers" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by all authenticated users" ON categories;

-- Create basic RLS policies for all tables
CREATE POLICY "Enable read access for authenticated users"
  ON items FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON stock_updates FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON categories FOR SELECT TO authenticated
  USING (true);

-- Update function to work with RLS
DROP FUNCTION IF EXISTS get_low_stock_items();
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  id uuid,
  name text,
  qty_in_stock integer,
  unit text,
  reorder_level integer
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    i.id,
    i.name,
    i.qty_in_stock,
    i.unit,
    i.reorder_level
  FROM items i
  WHERE i.reorder_level IS NOT NULL
    AND i.qty_in_stock <= i.reorder_level
  ORDER BY (i.qty_in_stock::float / NULLIF(i.reorder_level, 0)) ASC;
$$;