/*
  # Update Admin User Role (Idempotent)

  1. Changes
    - Make updates idempotent with DO block
*/

DO $$ 
BEGIN
  -- Only update if admin user exists with this email
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@email.com') THEN
    UPDATE auth.users
    SET role = 'admin'
    WHERE email = 'admin@email.com';

    UPDATE profiles
    SET role = 'admin'
    WHERE id IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'admin@email.com'
    );
  END IF;
END $$;