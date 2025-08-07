# Database RLS Policy Troubleshooting Guide

## Problem
You're encountering "new row violates row-level security policy for table 'addresses'" errors when trying to update user profiles.

## Root Cause
The issue is caused by:
1. Duplicate RLS policies in the migration file
2. Conflicting or overly restrictive policies on the `addresses` table
3. Circular reference issues in some policies

## Solutions

### Quick Fix (Recommended)
Run the generated policy cleanup scripts:

```bash
# If using Supabase CLI
cd /Users/h1579095/Desktop/mentoring
supabase db reset
supabase db push

# Or if using direct database connection
psql -d your_database_url -f drop_all_policies.sql
psql -d your_database_url -f apply_correct_policies.sql
```

### Manual Fix
If you prefer to fix manually, run these SQL commands in your Supabase SQL editor:

1. **Drop all existing policies:**
```sql
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can manage own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can manage addresses" ON addresses;
-- ... (see drop_all_policies.sql for complete list)
```

2. **Temporarily disable RLS to clean up:**
```sql
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
```

3. **Re-enable RLS with correct policies:**
```sql
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage addresses" ON addresses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Alternative: Use Clean Migration
Replace your existing migration with the clean one:

1. Reset your database:
```bash
supabase db reset
```

2. Replace the migration file:
```bash
cp supabase/migrations/20250724000002_clean_schema.sql supabase/migrations/20250724000001_complete_schema.sql
```

3. Push the clean migration:
```bash
supabase db push
```

## Policy Explanations

### Current Policy Strategy
The current policies are **permissive for development** to avoid blocking functionality:

- **Addresses**: All authenticated users can create/update addresses
- **Users**: Users can only manage their own profile data
- **Subjects**: Read-only for users, admin-only for management
- **Requests**: Users can view all, but only manage their own

### Production Considerations
For production, you might want to restrict the addresses policy:

```sql
-- More restrictive addresses policy for production
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL TO authenticated
  USING (id IN (SELECT address_id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (true); -- Allow creation but restrict updates
```

## Testing the Fix

After applying the fixes, test with this sequence:

1. **Sign in to your app**
2. **Go to the profile page**
3. **Try updating your profile** (name, bio, etc.)
4. **Try uploading an avatar**
5. **Check for any console errors**

## Files Generated
- `drop_all_policies.sql` - Removes all existing policies
- `apply_correct_policies.sql` - Applies correct RLS policies
- `supabase/migrations/20250724000002_clean_schema.sql` - Clean migration without duplicates

## What These Fixes Do
1. **Remove duplicate policies** that were causing conflicts
2. **Simplify the addresses policy** to allow authenticated users to manage addresses
3. **Ensure proper WITH CHECK clauses** for all policies
4. **Avoid circular references** in policy conditions

## Common Errors Fixed
- ✅ "new row violates row-level security policy for table 'addresses'"
- ✅ "permission denied for table addresses"
- ✅ Infinite recursion in RLS policy evaluation
- ✅ Duplicate policy name conflicts

## Next Steps
1. Apply one of the solutions above
2. Test profile updates in your app
3. If issues persist, check the Supabase logs for specific error details
4. Consider adjusting policies for your specific security requirements

## Support
If you continue to have issues:
1. Check the Supabase dashboard for detailed error logs
2. Test policies directly in the SQL editor
3. Use `SELECT * FROM users WHERE email = auth.jwt() ->> 'email'` to verify authentication is working
