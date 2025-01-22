/*
  # Fix permissions for all users
  
  1. Changes
    - Grant full access to all tables for authenticated users
    - Create permissive policies for all tables
    - Remove all role-based restrictions
*/

-- Grant full permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create permissive policies for all tables
CREATE POLICY "Allow all operations" ON items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON stock_updates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON locations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Recreate function without any role restrictions
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  id uuid,
  name text,
  qty_in_stock integer,
  unit text,
  reorder_level integer
) 
LANGUAGE sql
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