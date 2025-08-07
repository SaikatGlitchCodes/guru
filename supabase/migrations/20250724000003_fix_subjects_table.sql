-- Add missing updated_at column to subjects table and fix other schema issues
-- This migration adds the missing updated_at column and ensures consistency

-- Add updated_at column to subjects table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE subjects ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add other missing columns to subjects table for consistency
DO $$
BEGIN
  -- Add icon column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'icon'
  ) THEN
    ALTER TABLE subjects ADD COLUMN icon text;
  END IF;

  -- Add difficulty_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE subjects ADD COLUMN difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert'));
  END IF;

  -- Add hourly_rate_min column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'hourly_rate_min'
  ) THEN
    ALTER TABLE subjects ADD COLUMN hourly_rate_min numeric DEFAULT 0;
  END IF;

  -- Add hourly_rate_max column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'hourly_rate_max'
  ) THEN
    ALTER TABLE subjects ADD COLUMN hourly_rate_max numeric DEFAULT 0;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE subjects ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Create or replace the update trigger for subjects table
DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;

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

-- Update existing subjects to have the current timestamp
UPDATE subjects SET updated_at = now() WHERE updated_at IS NULL;

-- Make sure the column is not null going forward
ALTER TABLE subjects ALTER COLUMN updated_at SET NOT NULL;
