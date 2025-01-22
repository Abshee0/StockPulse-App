/*
  # Fix Function Permissions
  
  1. Changes
    - Remove SECURITY DEFINER and role settings from get_low_stock_items function
    - Make function accessible to all authenticated users
*/

-- Drop and recreate function without security context
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
SECURITY INVOKER
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_low_stock_items TO authenticated;