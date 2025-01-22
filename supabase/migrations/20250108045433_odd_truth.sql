/*
  # Simplify permissions and remove admin role dependencies
  
  1. Changes
    - Remove all admin role dependencies
    - Grant basic permissions to authenticated users
    - Simplify RLS policies
*/

-- Revoke any admin-specific permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM admin;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM admin;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM admin;
REVOKE USAGE ON SCHEMA public FROM admin;

-- Drop and recreate function with simplified permissions
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

-- Grant basic permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_low_stock_items() TO authenticated;

-- Simplify RLS policies
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access" ON items;
DROP POLICY IF EXISTS "Allow read access" ON stock_updates;

CREATE POLICY "Allow read access" ON items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access" ON stock_updates
    FOR SELECT TO authenticated USING (true);