/*
  # Update permissions without dropping admin role
  
  1. Changes
    - Update function to be security invoker
    - Grant full access to authenticated users
    - Create permissive RLS policies
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

-- Create permissive RLS policies
DO $$ 
BEGIN
  -- Drop existing restrictive policies
  DROP POLICY IF EXISTS "Categories are manageable by admins" ON categories;
  DROP POLICY IF EXISTS "Profiles are manageable by admins" ON profiles;
  
  -- Create new permissive policies
  CREATE POLICY "Enable full access for authenticated users" ON items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON stock_updates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON brands
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON locations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
  CREATE POLICY "Enable full access for authenticated users" ON profiles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;