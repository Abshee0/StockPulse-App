/*
  # Fix Role Policies and Permissions

  1. Changes
    - Remove references to admin role in RLS policies
    - Update policies to use profiles table role field
    - Fix function permissions
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Categories are manageable by admins" ON categories;
DROP POLICY IF EXISTS "Profiles are manageable by admins" ON profiles;

-- Create new policies using profile roles
CREATE POLICY "Categories are manageable by admins and managers"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Profiles are manageable by admins and managers"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Update function to use proper security context
DROP FUNCTION IF EXISTS get_low_stock_items();
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  id uuid,
  name text,
  qty_in_stock integer,
  unit text,
  reorder_level integer
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
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
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_low_stock_items TO authenticated;

-- Ensure all tables have basic read access for authenticated users
DO $$ 
BEGIN
  -- Items
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'items' AND policyname = 'Items are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Items are viewable by authenticated users"
      ON items FOR SELECT TO authenticated USING (true);
  END IF;

  -- Stock Updates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stock_updates' AND policyname = 'Stock updates are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Stock updates are viewable by authenticated users"
      ON stock_updates FOR SELECT TO authenticated USING (true);
  END IF;

  -- Orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Orders are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Orders are viewable by authenticated users"
      ON orders FOR SELECT TO authenticated USING (true);
  END IF;
END $$;