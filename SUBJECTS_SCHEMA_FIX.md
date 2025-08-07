# Subjects Table Schema Error Fix

## Problem
Error: "Could not find the 'updated_at' column of 'subjects' in the schema cache"

## Root Cause
The `subjects` table in your current database is missing the `updated_at` column and other columns that the API expects to exist.

## Solution

### Option 1: Run SQL Script in Supabase Dashboard (Recommended)

1. **Open your Supabase dashboard**
2. **Go to the SQL Editor**
3. **Copy and paste the contents of `fix_subjects_table.sql`**
4. **Click "Run" to execute the script**

This will:
- ✅ Add the missing `updated_at` column
- ✅ Add other missing columns (icon, difficulty_level, hourly_rate_min, hourly_rate_max, is_active)
- ✅ Create proper update triggers
- ✅ Insert sample subjects if the table is empty
- ✅ Verify the schema changes

### Option 2: Manual Column Addition

If you prefer to add just the essential column manually:

```sql
-- Add the missing updated_at column
ALTER TABLE subjects ADD COLUMN updated_at timestamptz DEFAULT now();

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subjects_updated_at 
  BEFORE UPDATE ON subjects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing records
UPDATE subjects SET updated_at = now();
ALTER TABLE subjects ALTER COLUMN updated_at SET NOT NULL;
```

### Option 3: Reset Database (Nuclear Option)

If you want to start completely fresh:

```bash
# If you have Supabase CLI installed
supabase db reset
supabase db push
```

## What This Fixes

- ✅ **Schema Cache Error**: Resolves the "could not find updated_at column" error
- ✅ **API Compatibility**: Makes the subjects table compatible with the API functions
- ✅ **Missing Columns**: Adds all expected columns for a complete subjects schema
- ✅ **Update Triggers**: Ensures updated_at is automatically maintained
- ✅ **Sample Data**: Provides basic subjects for testing

## Updated Subjects Table Schema

After running the fix, your subjects table will have:

```sql
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text,
  icon text,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate_min numeric DEFAULT 0,
  hourly_rate_max numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Testing the Fix

After applying the fix, test these operations:

1. **Get all subjects**:
   ```javascript
   import { getAllSubjects } from '@/lib/supabaseAPI'
   const { data, error } = await getAllSubjects()
   console.log('Subjects:', data)
   ```

2. **Create a subject**:
   ```javascript
   import { createSubject } from '@/lib/supabaseAPI'
   const { data, error } = await createSubject({
     name: 'Test Subject',
     description: 'A test subject',
     category: 'Test'
   })
   ```

3. **Check in Supabase dashboard**:
   - Go to Table Editor
   - Open the subjects table
   - Verify the `updated_at` column exists
   - Check that sample data was inserted

## Common Issues After Fix

1. **Cache Issues**: If you still see the error, try:
   - Refresh your browser
   - Clear browser cache
   - Restart your development server

2. **RLS Policies**: Make sure RLS policies allow reading subjects:
   ```sql
   -- This should already exist from previous fixes
   CREATE POLICY "Authenticated users can read subjects" ON subjects
     FOR SELECT TO authenticated
     USING (true);
   ```

## Files Created/Updated

- ✅ `fix_subjects_table.sql` - Complete fix script
- ✅ `supabase/migrations/20250724000003_fix_subjects_table.sql` - Migration file
- ✅ `lib/supabaseAPI.js` - Added createSubject and updateSubject functions

## Next Steps

1. Run the fix script in your Supabase SQL Editor
2. Test the subjects functionality in your app
3. Verify that the error no longer appears
4. Consider adding more subjects specific to your platform's needs

If you continue to have issues, check the browser console for any additional error details and verify that your database connection is working properly.
