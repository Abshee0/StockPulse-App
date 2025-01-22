/*
  # Update function and permissions
  
  1. Changes
    - Recreate function with SECURITY INVOKER
    - Grant permissions to authenticated users
    - Drop existing policies before creating new ones
*/

-- Recreate function without role requirements
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

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Drop existing policies first
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON items;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON stock_updates;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON categories;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON brands;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON locations;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON orders;
  DROP POLICY IF EXISTS "Enable full access for authenticated users" ON profiles;
END $$;