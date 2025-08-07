/*
  # Additional Database Schema for Mentoring Platform
  
  This migration adds missing tables and features for the complete mentoring platform:
  1. Tutors table for tutor profiles and availability
  2. Tutor subjects junction table
  3. Availability schedules
  4. Sessions/bookings
  5. Notifications
  6. File uploads
  7. Enhanced user features
  
  Note: This migration assumes the base tables (users, addresses, subjects, requests, reviews) 
  already exist from the initial migration.
*/

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if required base tables exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'Base table "users" does not exist. Please run the initial migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subjects') THEN
        RAISE EXCEPTION 'Base table "subjects" does not exist. Please run the initial migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'requests') THEN
        RAISE EXCEPTION 'Base table "requests" does not exist. Please run the initial migration first.';
    END IF;
END $$;

-- Tutors table (extends users with tutor-specific information)
CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  hourly_rate numeric NOT NULL DEFAULT 0,
  experience_years integer DEFAULT 0,
  education text,
  certifications text[],
  languages text[] DEFAULT '{}',
  teaching_style text,
  specializations text[],
  response_time text DEFAULT '< 24 hours',
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  verified boolean DEFAULT false,
  verification_documents text[],
  background_check boolean DEFAULT false,
  preferred_meeting_types text[] DEFAULT '{}', -- ['online', 'offline', 'travel']
  travel_radius_km integer DEFAULT 10,
  minimum_session_duration integer DEFAULT 60, -- in minutes
  cancellation_policy text,
  instant_booking boolean DEFAULT false,
  total_sessions integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  success_rate numeric DEFAULT 0, -- percentage of successful sessions
  response_rate numeric DEFAULT 0, -- percentage of messages responded to
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutor subjects junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer DEFAULT 0,
  hourly_rate_override numeric, -- subject-specific rate if different from base rate
  created_at timestamptz DEFAULT now(),
  UNIQUE(tutor_id, subject_id)
);

-- Availability schedules
CREATE TABLE IF NOT EXISTS tutor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text DEFAULT 'UTC',
  is_recurring boolean DEFAULT true,
  specific_date date, -- for one-time availability
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Sessions/Bookings table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id),
  tutor_id uuid NOT NULL REFERENCES tutors(id),
  request_id uuid REFERENCES requests(id),
  subject_id uuid REFERENCES subjects(id),
  title text NOT NULL,
  description text,
  session_type text NOT NULL CHECK (session_type IN ('online', 'offline', 'travel')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  meeting_link text, -- for online sessions
  meeting_location text, -- for offline sessions
  hourly_rate numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  notes text, -- session notes by tutor
  homework text, -- homework assigned
  materials_shared text[], -- URLs or file references
  recording_url text, -- for recorded sessions
  cancelled_by uuid REFERENCES users(id),
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (scheduled_start < scheduled_end)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'message', 'session_reminder', 'payment', 'review', 'application', etc.
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid, -- ID of related entity (session, request, etc.)
  related_type text, -- type of related entity
  read boolean DEFAULT false,
  action_url text, -- URL to navigate when notification is clicked
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_for timestamptz, -- for scheduled notifications
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid NOT NULL REFERENCES users(id),
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_type text NOT NULL, -- 'avatar', 'document', 'material', 'verification', etc.
  related_id uuid, -- ID of related entity
  related_type text, -- type of related entity
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews enhancement (add response from reviewee)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_date timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0;

-- Enhanced user table with additional fields for tutoring platform
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active timestamptz DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completion_percentage integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS government_id_verified boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);
CREATE INDEX IF NOT EXISTS idx_tutors_hourly_rate ON tutors(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_tutors_availability_status ON tutors(availability_status);
CREATE INDEX IF NOT EXISTS idx_tutors_verified ON tutors(verified);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_tutor_id ON tutor_subjects(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_subject_id ON tutor_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_tutor_id ON tutor_availability(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_day_time ON tutor_availability(day_of_week, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor_id ON sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_start ON sessions(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploader_id ON file_uploads(uploader_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_related ON file_uploads(related_id, related_type);

-- Enable Row Level Security for new tables
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutors table
CREATE POLICY "Anyone can read verified tutor profiles" ON tutors
  FOR SELECT TO authenticated
  USING (verified = true OR user_id::text = auth.uid()::text);

CREATE POLICY "Tutors can manage own profile" ON tutors
  FOR ALL TO authenticated
  USING (user_id::text = auth.uid()::text);

-- RLS Policies for tutor_subjects table
CREATE POLICY "Anyone can read tutor subjects" ON tutor_subjects
  FOR SELECT TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE verified = true));

CREATE POLICY "Tutors can manage own subjects" ON tutor_subjects
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id::text = auth.uid()::text));

-- RLS Policies for tutor_availability table
CREATE POLICY "Anyone can read tutor availability" ON tutor_availability
  FOR SELECT TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE verified = true));

CREATE POLICY "Tutors can manage own availability" ON tutor_availability
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id::text = auth.uid()::text));

-- RLS Policies for sessions table
CREATE POLICY "Users can read own sessions" ON sessions
  FOR SELECT TO authenticated
  USING (
    student_id::text = auth.uid()::text OR 
    tutor_id IN (SELECT id FROM tutors WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage own sessions" ON sessions
  FOR ALL TO authenticated
  USING (
    student_id::text = auth.uid()::text OR 
    tutor_id IN (SELECT id FROM tutors WHERE user_id::text = auth.uid()::text)
  );

-- RLS Policies for notifications table
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id::text = auth.uid()::text);

-- RLS Policies for file_uploads table
CREATE POLICY "Users can read own files" ON file_uploads
  FOR SELECT TO authenticated
  USING (uploader_id::text = auth.uid()::text OR is_public = true);

CREATE POLICY "Users can upload files" ON file_uploads
  FOR INSERT TO authenticated
  WITH CHECK (uploader_id::text = auth.uid()::text);

-- Create functions and triggers for tutors table
CREATE OR REPLACE FUNCTION update_tutor_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tutor stats when a session is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE tutors 
    SET 
      total_sessions = total_sessions + 1,
      total_earnings = total_earnings + NEW.total_amount
    WHERE id = NEW.tutor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tutor_stats
  AFTER UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_tutor_stats();

-- Create function to calculate profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion_percentage integer := 0;
BEGIN
  -- Basic fields (40%)
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    completion_percentage := completion_percentage + 5;
  END IF;
  
  IF NEW.phone_number IS NOT NULL AND NEW.phone_number != '' THEN
    completion_percentage := completion_percentage + 5;
  END IF;
  
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  -- Verification fields (30%)
  IF NEW.email_verified = true THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  IF NEW.phone_verified = true THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  IF NEW.government_id_verified = true THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  -- Address (10%)
  IF NEW.address_id IS NOT NULL THEN
    completion_percentage := completion_percentage + 10;
  END IF;
  
  -- Role-specific completion (20%)
  IF NEW.role = 'tutor' THEN
    -- Check if tutor profile exists and is complete
    IF EXISTS (
      SELECT 1 FROM tutors 
      WHERE user_id = NEW.id 
      AND hourly_rate > 0 
      AND education IS NOT NULL
    ) THEN
      completion_percentage := completion_percentage + 20;
    END IF;
  ELSE
    -- For students, having any request counts as complete
    IF EXISTS (SELECT 1 FROM requests WHERE user_id = NEW.id) THEN
      completion_percentage := completion_percentage + 20;
    END IF;
  END IF;
  
  NEW.profile_completion_percentage := completion_percentage;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_profile_completion
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completion();

-- Add triggers for updated_at columns on new tables
CREATE TRIGGER trigger_tutors_updated_at
  BEFORE UPDATE ON tutors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tutor data (for demo purposes)
INSERT INTO subjects (name, description, category) VALUES
  ('Physics', 'Classical Mechanics, Quantum Physics, Thermodynamics', 'STEM'),
  ('Chemistry', 'Organic Chemistry, Inorganic Chemistry, Physical Chemistry', 'STEM'),
  ('Biology', 'Molecular Biology, Genetics, Ecology, Anatomy', 'STEM'),
  ('Literature', 'Classic Literature, Modern Literature, Poetry Analysis', 'Language Arts'),
  ('Programming', 'Python, JavaScript, Java, C++, Web Development', 'STEM'),
  ('Spanish', 'Conversational Spanish, Grammar, Literature', 'Language Arts'),
  ('French', 'Conversational French, Grammar, Culture', 'Language Arts'),
  ('Economics', 'Microeconomics, Macroeconomics, Behavioral Economics', 'Business'),
  ('Statistics', 'Descriptive Statistics, Inferential Statistics, Data Analysis', 'STEM'),
  ('Writing', 'Creative Writing, Academic Writing, Technical Writing', 'Language Arts')
ON CONFLICT (name) DO NOTHING;

-- Create view for tutor search (used by find-tutors page)
CREATE OR REPLACE VIEW tutor_search_view AS
SELECT 
  t.id,
  u.name,
  u.avatar_url,
  u.rating,
  u.total_reviews,
  t.hourly_rate,
  t.experience_years,
  t.response_time,
  t.availability_status,
  t.verified,
  t.languages,
  t.specializations,
  t.preferred_meeting_types,
  u.bio,
  a.city,
  a.state,
  a.country,
  CONCAT(a.city, ', ', a.state) as location,
  array_agg(DISTINCT s.name) as subjects,
  u.last_active,
  t.instant_booking,
  t.success_rate,
  t.response_rate,
  t.total_sessions
FROM tutors t
JOIN users u ON t.user_id = u.id
LEFT JOIN addresses a ON u.address_id = a.id
LEFT JOIN tutor_subjects ts ON t.id = ts.tutor_id
LEFT JOIN subjects s ON ts.subject_id = s.id
WHERE t.verified = true AND u.status = 'active'
GROUP BY t.id, u.id, a.id;

COMMENT ON VIEW tutor_search_view IS 'Optimized view for tutor search and listing pages';
