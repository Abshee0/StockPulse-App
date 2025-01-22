/*
  # Fix final permissions issues
  
  1. Changes
    - Drop and recreate get_low_stock_items function with no role requirements
    - Ensure proper access to items and stock_updates tables
    - Remove any remaining admin role dependencies
*/

-- Drop and recreate function with no role requirements
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
SECURITY DEFINER
SET search_path = public
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

-- Ensure proper access to the function
REVOKE ALL ON FUNCTION get_low_stock_items() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_low_stock_items() TO authenticated;

-- Ensure RLS policies allow proper access
DROP POLICY IF EXISTS "Allow read access" ON items;
DROP POLICY IF EXISTS "Allow read access" ON stock_updates;

CREATE POLICY "Allow read access" ON items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access" ON stock_updates
    FOR SELECT TO authenticated USING (true);

-- Grant necessary table permissions
GRANT SELECT ON items TO authenticated;
GRANT SELECT ON stock_updates TO authenticated;