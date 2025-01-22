/*
  # Update Admin User Role
  
  1. Changes
    - Update the role of the admin user from 'authenticated' to 'admin'
    
  2. Security
    - Ensures admin user has proper administrative privileges
*/

-- Update the admin user's role to 'admin'
UPDATE auth.users
SET role = 'admin'
WHERE email = 'admin@email.com';

-- Verify profile role is set to 'admin'
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@email.com'
);