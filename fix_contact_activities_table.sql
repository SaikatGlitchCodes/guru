-- Run this SQL in your Supabase SQL Editor to fix the contact_activities table
-- This will allow tracking of direct tutor contact purchases

-- Step 1: Add user_id column to track who purchased the contact
ALTER TABLE contact_activities 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);

-- Step 2: Make request_id nullable to support direct tutor contacts
ALTER TABLE contact_activities 
ALTER COLUMN request_id DROP NOT NULL;

-- Step 3: Add constraint to ensure we have user context
ALTER TABLE contact_activities 
ADD CONSTRAINT IF NOT EXISTS contact_activities_user_check 
CHECK (user_id IS NOT NULL);

-- Step 4: Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_contact_activities_user_tutor 
ON contact_activities(user_id, tutor_email);

CREATE INDEX IF NOT EXISTS idx_contact_activities_tutor 
ON contact_activities(tutor_email);

-- Step 5: Add helpful comments
COMMENT ON TABLE contact_activities IS 'Tracks when users purchase contact access to tutors (both request-based and direct profile access)';
COMMENT ON COLUMN contact_activities.user_id IS 'ID of the user who purchased contact access';
COMMENT ON COLUMN contact_activities.request_id IS 'ID of the request (nullable for direct tutor contact purchases)';

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_activities'
ORDER BY ordinal_position;
