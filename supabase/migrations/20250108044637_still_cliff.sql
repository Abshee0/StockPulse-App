/*
  # Fix Permissions Issues
  
  1. Changes
    - Remove role-based policies
    - Add simplified RLS policies based on profile roles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are manageable by admins and managers" ON categories;
DROP POLICY IF EXISTS "Profiles are manageable by admins and managers" ON profiles;

-- Create simplified policies using profile roles
CREATE POLICY "Categories are viewable by all authenticated users"
  ON categories FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Categories are manageable by admins and managers"
  ON categories FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Update function to remove SECURITY DEFINER
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