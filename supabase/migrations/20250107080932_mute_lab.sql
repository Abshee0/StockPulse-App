/*
  # Fix Database Permissions

  1. Changes
    - Drop and recreate policies for items and stock_updates
    - Update get_low_stock_items function with proper permissions
*/

-- Drop and recreate function with proper permissions
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