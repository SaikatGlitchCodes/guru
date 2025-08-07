/*
  # Clean Database Schema for Mentoring Platform
  
  This is a clean migration that creates all tables and proper RLS policies
  without duplicates. Use this for a fresh database setup.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
  phone_number text,
  gender text,
  bio text,
  years_of_experience numeric DEFAULT 0,
  hobbies text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  coin_balance integer DEFAULT 0,
  avatar_url text,
  rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  address_id uuid,
  last_active timestamptz DEFAULT now(),
  timezone text DEFAULT 'UTC',
  preferred_language text DEFAULT 'English',
  profile_completion_percentage integer DEFAULT 0,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  government_id_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street text,
  city text,
  state text,
  zip text,
  country text,
  country_code text,
  lat numeric,
  lon numeric,
  address_line_1 text,
  address_line_2 text,
  formatted_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
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

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  budget_min numeric,
  budget_max numeric,
  preferred_meeting_type text CHECK (preferred_meeting_type IN ('online', 'in_person', 'both')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  urgency text DEFAULT 'moderate' CHECK (urgency IN ('low', 'moderate', 'high', 'urgent')),
  estimated_duration_hours numeric DEFAULT 1,
  preferred_schedule text,
  location_preference text,
  special_requirements text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Request subjects junction table
CREATE TABLE IF NOT EXISTS request_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  proficiency_required text CHECK (proficiency_required IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(request_id, subject_id)
);

-- User subjects junction table (for tutors)
CREATE TABLE IF NOT EXISTS user_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  proficiency_level text CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate numeric DEFAULT 0,
  years_of_experience numeric DEFAULT 0,
  certifications text[],
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  tags text[],
  is_anonymous boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  meeting_type text CHECK (meeting_type IN ('online', 'in_person')),
  meeting_url text,
  meeting_location text,
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  hourly_rate numeric NOT NULL,
  total_cost numeric,
  notes text,
  recording_url text,
  materials text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Session participants table
CREATE TABLE IF NOT EXISTS session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('tutor', 'student', 'observer')),
  joined_at timestamptz,
  left_at timestamptz,
  attendance_status text DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'attended', 'absent', 'late')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'coins')),
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_type text CHECK (payment_type IN ('session_payment', 'coin_purchase', 'withdrawal', 'refund')),
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
  category text CHECK (category IN ('session', 'payment', 'review', 'system', 'promotion')),
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_email boolean DEFAULT true,
  notification_push boolean DEFAULT true,
  notification_sms boolean DEFAULT false,
  marketing_emails boolean DEFAULT false,
  privacy_level text DEFAULT 'normal' CHECK (privacy_level IN ('public', 'normal', 'private')),
  auto_accept_sessions boolean DEFAULT false,
  preferred_session_duration integer DEFAULT 60,
  time_buffer_minutes integer DEFAULT 15,
  max_daily_sessions integer DEFAULT 8,
  weekend_availability boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  recurring_weekly boolean DEFAULT true,
  specific_date date,
  max_sessions integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  request_id uuid REFERENCES requests(id) ON DELETE SET NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachment_url text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
DO $$
BEGIN
  -- Add address_id foreign key to users table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'users_address_id_fkey') THEN
    ALTER TABLE users ADD CONSTRAINT users_address_id_fkey 
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL;
  END IF;

  -- Add session_id foreign key to reviews table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'reviews_session_id_fkey') THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_session_id_fkey 
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
  -- Users indexes
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_users_role') THEN
    CREATE INDEX idx_users_role ON users(role);
  END IF;
  
  -- Requests indexes
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_requests_student_id') THEN
    CREATE INDEX idx_requests_student_id ON requests(student_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_requests_status') THEN
    CREATE INDEX idx_requests_status ON requests(status);
  END IF;
  
  -- Sessions indexes
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_sessions_tutor_id') THEN
    CREATE INDEX idx_sessions_tutor_id ON sessions(tutor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_sessions_scheduled_start') THEN
    CREATE INDEX idx_sessions_scheduled_start ON sessions(scheduled_start);
  END IF;
  
  -- User subjects indexes
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_user_subjects_user_id') THEN
    CREATE INDEX idx_user_subjects_user_id ON user_subjects(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_user_subjects_subject_id') THEN
    CREATE INDEX idx_user_subjects_subject_id ON user_subjects(subject_id);
  END IF;
END $$;

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to tables
DO $$
BEGIN
  -- Users table trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Addresses table trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_addresses_updated_at') THEN
    CREATE TRIGGER update_addresses_updated_at 
    BEFORE UPDATE ON addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Other table triggers
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subjects_updated_at') THEN
    CREATE TRIGGER update_subjects_updated_at 
    BEFORE UPDATE ON subjects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_requests_updated_at') THEN
    CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subjects_updated_at') THEN
    CREATE TRIGGER update_user_subjects_updated_at 
    BEFORE UPDATE ON user_subjects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reviews_updated_at') THEN
    CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sessions_updated_at') THEN
    CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
    CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_preferences_updated_at') THEN
    CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_availability_slots_updated_at') THEN
    CREATE TRIGGER update_availability_slots_updated_at 
    BEFORE UPDATE ON availability_slots 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view and edit own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can manage addresses" ON addresses;
DROP POLICY IF EXISTS "Authenticated users can read subjects" ON subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
DROP POLICY IF EXISTS "Users can view all requests" ON requests;
DROP POLICY IF EXISTS "Users can create requests" ON requests;
DROP POLICY IF EXISTS "Users can update own requests" ON requests;
DROP POLICY IF EXISTS "Users can view request subjects" ON request_subjects;
DROP POLICY IF EXISTS "Users can manage request subjects for own requests" ON request_subjects;
DROP POLICY IF EXISTS "Users can view all user subjects" ON user_subjects;
DROP POLICY IF EXISTS "Users can manage own subjects" ON user_subjects;
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;
DROP POLICY IF EXISTS "Tutors can create sessions" ON sessions;
DROP POLICY IF EXISTS "Participants can update sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view session participants" ON session_participants;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can view tutor availability" ON availability_slots;
DROP POLICY IF EXISTS "Tutors can manage own availability" ON availability_slots;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Create RLS policies

-- Users policies - Allow users to manage their own data
CREATE POLICY "Users can view and edit own profile" ON users
  FOR ALL TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Addresses policies - Allow all authenticated users to manage addresses
-- This is permissive for development; in production, you might want to restrict this
CREATE POLICY "Authenticated users can manage addresses" ON addresses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Subjects policies - Public read access for authenticated users
CREATE POLICY "Authenticated users can read subjects" ON subjects
  FOR SELECT TO authenticated
  USING (true);

-- Allow admins to manage subjects
CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.email = auth.jwt() ->> 'email' AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.email = auth.jwt() ->> 'email' AND users.role = 'admin'));

-- Requests policies - Users can read all requests, manage their own
CREATE POLICY "Users can view all requests" ON requests
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create requests" ON requests
  FOR INSERT TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own requests" ON requests
  FOR UPDATE TO authenticated
  USING (student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Request subjects policies
CREATE POLICY "Users can view request subjects" ON request_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage request subjects for own requests" ON request_subjects
  FOR ALL TO authenticated
  USING (request_id IN (SELECT id FROM requests WHERE student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email')))
  WITH CHECK (request_id IN (SELECT id FROM requests WHERE student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email')));

-- User subjects policies
CREATE POLICY "Users can view all user subjects" ON user_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own subjects" ON user_subjects
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Reviews policies
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Sessions policies
CREATE POLICY "Users can view sessions they participate in" ON sessions
  FOR SELECT TO authenticated
  USING (
    tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email') OR
    request_id IN (SELECT id FROM requests WHERE student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  );

CREATE POLICY "Tutors can create sessions" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Participants can update sessions" ON sessions
  FOR UPDATE TO authenticated
  USING (
    tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email') OR
    request_id IN (SELECT id FROM requests WHERE student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  );

-- Session participants policies
CREATE POLICY "Users can view session participants" ON session_participants
  FOR SELECT TO authenticated
  USING (
    user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email') OR
    session_id IN (
      SELECT id FROM sessions WHERE 
      tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email') OR
      request_id IN (SELECT id FROM requests WHERE student_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Availability slots policies
CREATE POLICY "Users can view tutor availability" ON availability_slots
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Tutors can manage own availability" ON availability_slots
  FOR ALL TO authenticated
  USING (tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'))
  WITH CHECK (tutor_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT TO authenticated
  USING (
    sender_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email') OR
    receiver_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id IN (SELECT id FROM users WHERE email = auth.jwt() ->> 'email'));
