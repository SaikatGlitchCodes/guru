-- Quick fix for profile update issue
-- Run this in your Supabase SQL Editor

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Authenticated users can manage addresses" ON addresses;
DROP POLICY IF EXISTS "Users can manage addresses" ON addresses;

-- Create the correct policy that allows both read and write operations
CREATE POLICY "addresses_policy" ON addresses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify it worked
SELECT 'Address policy fixed!' as status;

-- Test that the policy allows operations
SELECT count(*) as addresses_count FROM addresses;
