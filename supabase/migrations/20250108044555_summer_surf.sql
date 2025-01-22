/*
  # Fix Admin Role Issues
  
  1. Changes
    - Create admin role if it doesn't exist
    - Grant necessary permissions
*/

DO $$ 
BEGIN
  -- Create admin role if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;

  -- Grant necessary permissions to admin role
  GRANT authenticated TO admin;
  GRANT USAGE ON SCHEMA public TO admin;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO admin;
END $$;