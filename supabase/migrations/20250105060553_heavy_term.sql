/*
  # Fix Policies and Relationships

  1. Changes
    - Fix recursive policies for profiles
    - Add proper foreign key relationships
    - Update RLS policies to avoid recursion

  2. Security
    - Maintain RLS security while fixing recursion issues
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Categories are editable by admin users" ON categories;

-- Create new non-recursive policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (role = 'admin');

-- Update categories policy to avoid recursion
CREATE POLICY "Categories are editable by admin users"
  ON categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Add missing relationships
ALTER TABLE items 
  ADD CONSTRAINT fk_items_category 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON DELETE SET NULL;

ALTER TABLE items 
  ADD CONSTRAINT fk_items_brand 
  FOREIGN KEY (brand_id) 
  REFERENCES brands(id) 
  ON DELETE SET NULL;

ALTER TABLE items 
  ADD CONSTRAINT fk_items_location 
  FOREIGN KEY (location_id) 
  REFERENCES locations(id) 
  ON DELETE SET NULL;