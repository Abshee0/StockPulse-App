-- Create a view for user management that joins profiles with auth.users
CREATE VIEW auth_users AS
SELECT 
  id,
  email,
  role
FROM auth.users;

-- Grant appropriate permissions
GRANT SELECT ON auth_users TO authenticated;

-- Update profile policies to allow role management
CREATE POLICY "Managers can update user roles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );