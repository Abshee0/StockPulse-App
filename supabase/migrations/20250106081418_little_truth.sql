/*
  # Fix Admin Role and Permissions

  1. Changes
    - Drop existing admin role references
    - Create proper role management
    - Update policies to use authenticated role instead of admin
    - Fix function permissions
  
  2. Security
    - Update RLS policies to use proper role checks
    - Ensure function permissions are properly set
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Categories are editable by admin users" ON categories;
DROP POLICY IF EXISTS "Admin users can update profiles" ON profiles;

-- Update profiles policies to use role column
CREATE POLICY "Profiles are manageable by admins"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update categories policies
CREATE POLICY "Categories are manageable by admins"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update get_low_stock_items function to use proper permissions
DROP FUNCTION IF EXISTS get_low_stock_items();
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  id uuid,
  name text,
  qty_in_stock integer,
  unit text,
  reorder_level integer
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_low_stock_items TO authenticated;

-- Ensure proper policies exist for stock_updates
DROP POLICY IF EXISTS "Stock updates are viewable by authenticated users" ON stock_updates;
CREATE POLICY "Stock updates are viewable by authenticated users"
  ON stock_updates
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure proper policies exist for items
DROP POLICY IF EXISTS "Items are viewable by authenticated users" ON items;
CREATE POLICY "Items are viewable by authenticated users"
  ON items
  FOR SELECT
  TO authenticated
  USING (true);