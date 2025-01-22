/*
  # Remove Role Policies and Enable Full Access
  
  1. Changes
    - Remove all role-based policies
    - Enable full access for authenticated users on all tables
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Categories are manageable by admins and managers" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by all authenticated users" ON categories;
DROP POLICY IF EXISTS "Profiles are manageable by admins" ON profiles;
DROP POLICY IF EXISTS "Profiles are manageable by admins and managers" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON items;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON stock_updates;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON categories;

-- Create full access policies for all tables
CREATE POLICY "Enable full access for authenticated users"
  ON items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON stock_updates FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON profiles FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON orders FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON brands FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
  ON locations FOR ALL TO authenticated
  USING (true) WITH CHECK (true);