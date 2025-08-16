-- Migration: Fix contact_activities table to support both request-based and direct tutor contacts
-- Date: 2025-08-16
-- Purpose: Add user_id column and make request_id nullable to support direct tutor contact purchases

-- Add user_id column to track who purchased the contact
ALTER TABLE contact_activities 
ADD COLUMN user_id uuid REFERENCES users(id);

-- Make request_id nullable to support direct tutor contacts (not just request-based)
ALTER TABLE contact_activities 
ALTER COLUMN request_id DROP NOT NULL;

-- Add a check constraint to ensure we have either user_id or request_id context
ALTER TABLE contact_activities 
ADD CONSTRAINT contact_activities_context_check 
CHECK (user_id IS NOT NULL);

-- Add an index for efficient lookups of user's contact purchases
CREATE INDEX IF NOT EXISTS idx_contact_activities_user_tutor 
ON contact_activities(user_id, tutor_email);

-- Add an index for tutor-based lookups
CREATE INDEX IF NOT EXISTS idx_contact_activities_tutor 
ON contact_activities(tutor_email);

-- Add comments for clarity
COMMENT ON TABLE contact_activities IS 'Tracks when users purchase contact access to tutors (either through requests or direct profile access)';
COMMENT ON COLUMN contact_activities.user_id IS 'ID of the user who purchased contact access';
COMMENT ON COLUMN contact_activities.request_id IS 'ID of the request (nullable for direct tutor contact purchases)';
COMMENT ON COLUMN contact_activities.tutor_email IS 'Email of the tutor whose contact was purchased';
COMMENT ON COLUMN contact_activities.coin_cost IS 'Number of coins spent for contact access';
