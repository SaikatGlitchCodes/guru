/*
  # Complete Database Schema for Mentoring Platform
  
  This is a combined migration that creates all tables needed for the mentoring platform.
  Use this if you want to set up the entire database from scratch.
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
  formatted text,
  created_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  address_id uuid,
  title text,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('Tutoring', 'Job Support', 'Assignment')),
  level text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  price_amount numeric NOT NULL,
  price_option text NOT NULL,
  price_currency text DEFAULT 'USD',
  price_currency_symbol text DEFAULT '$',
  gender_preference text DEFAULT 'None',
  tutors_want text DEFAULT 'Only one',
  i_need_someone text DEFAULT 'part time',
  language jsonb DEFAULT '[]',
  get_tutors_from text,
  online_meeting boolean DEFAULT false,
  offline_meeting boolean DEFAULT false,
  travel_meeting boolean DEFAULT false,
  urgency text DEFAULT 'flexible',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Request subjects junction table
CREATE TABLE IF NOT EXISTS request_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(request_id, subject_id)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL,
  tutor_id uuid NOT NULL,
  message text,
  proposed_rate numeric,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(request_id, tutor_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  request_id uuid,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  request_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  response text,
  response_date timestamptz,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, reviewee_id, request_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'payment', 'refund')),
  amount integer NOT NULL,
  description text,
  reference_id uuid,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Tutors table (extends users with tutor-specific information)
CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
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
  preferred_meeting_types text[] DEFAULT '{}',
  travel_radius_km integer DEFAULT 10,
  minimum_session_duration integer DEFAULT 60,
  cancellation_policy text,
  instant_booking boolean DEFAULT false,
  total_sessions integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  success_rate numeric DEFAULT 0,
  response_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutor subjects junction table
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience integer DEFAULT 0,
  hourly_rate_override numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tutor_id, subject_id)
);

-- Availability schedules
CREATE TABLE IF NOT EXISTS tutor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text DEFAULT 'UTC',
  is_recurring boolean DEFAULT true,
  specific_date date,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Sessions/Bookings table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  tutor_id uuid NOT NULL,
  request_id uuid,
  subject_id uuid,
  title text NOT NULL,
  description text,
  session_type text NOT NULL CHECK (session_type IN ('online', 'offline', 'travel')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  actual_start timestamptz,
  actual_end timestamptz,
  meeting_link text,
  meeting_location text,
  hourly_rate numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  notes text,
  homework text,
  materials_shared text[],
  recording_url text,
  cancelled_by uuid,
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (scheduled_start < scheduled_end)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid,
  related_type text,
  read boolean DEFAULT false,
  action_url text,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid NOT NULL,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_type text NOT NULL,
  related_id uuid,
  related_type text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
DO $$
BEGIN
    -- Users address constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_address') THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_address FOREIGN KEY (address_id) REFERENCES addresses(id);
    END IF;
    
    -- Requests constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_requests_user') THEN
        ALTER TABLE requests ADD CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_requests_address') THEN
        ALTER TABLE requests ADD CONSTRAINT fk_requests_address FOREIGN KEY (address_id) REFERENCES addresses(id);
    END IF;
    
    -- Request subjects constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_subjects_request') THEN
        ALTER TABLE request_subjects ADD CONSTRAINT fk_request_subjects_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_subjects_subject') THEN
        ALTER TABLE request_subjects ADD CONSTRAINT fk_request_subjects_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
    END IF;
    
    -- Applications constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_applications_request') THEN
        ALTER TABLE applications ADD CONSTRAINT fk_applications_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_applications_tutor') THEN
        ALTER TABLE applications ADD CONSTRAINT fk_applications_tutor FOREIGN KEY (tutor_id) REFERENCES users(id);
    END IF;
    
    -- Messages constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_messages_sender') THEN
        ALTER TABLE messages ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_messages_recipient') THEN
        ALTER TABLE messages ADD CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_messages_request') THEN
        ALTER TABLE messages ADD CONSTRAINT fk_messages_request FOREIGN KEY (request_id) REFERENCES requests(id);
    END IF;
    
    -- Reviews constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_reviewer') THEN
        ALTER TABLE reviews ADD CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_reviewee') THEN
        ALTER TABLE reviews ADD CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_request') THEN
        ALTER TABLE reviews ADD CONSTRAINT fk_reviews_request FOREIGN KEY (request_id) REFERENCES requests(id);
    END IF;
    
    -- Transactions constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_user') THEN
        ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
    
    -- Tutors constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutors_user') THEN
        ALTER TABLE tutors ADD CONSTRAINT fk_tutors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    -- Tutor subjects constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_subjects_tutor') THEN
        ALTER TABLE tutor_subjects ADD CONSTRAINT fk_tutor_subjects_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_subjects_subject') THEN
        ALTER TABLE tutor_subjects ADD CONSTRAINT fk_tutor_subjects_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
    END IF;
    
    -- Tutor availability constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tutor_availability_tutor') THEN
        ALTER TABLE tutor_availability ADD CONSTRAINT fk_tutor_availability_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE;
    END IF;
    
    -- Sessions constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_student') THEN
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_student FOREIGN KEY (student_id) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_tutor') THEN
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_request') THEN
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_request FOREIGN KEY (request_id) REFERENCES requests(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_subject') THEN
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_subject FOREIGN KEY (subject_id) REFERENCES subjects(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sessions_cancelled_by') THEN
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES users(id);
    END IF;
    
    -- Notifications constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_notifications_user') THEN
        ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    -- File uploads constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_file_uploads_uploader') THEN
        ALTER TABLE file_uploads ADD CONSTRAINT fk_file_uploads_uploader FOREIGN KEY (uploader_id) REFERENCES users(id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);
CREATE INDEX IF NOT EXISTS idx_applications_request_id ON applications(request_id);
CREATE INDEX IF NOT EXISTS idx_applications_tutor_id ON applications(tutor_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
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

-- Enable Row Level Security (but keep policies simple to avoid recursion)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Simplified to avoid recursion)

-- Users policies - Use email-based authentication
CREATE POLICY "Users can manage own data" ON users
  FOR ALL TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Addresses policies - Allow authenticated users to manage addresses
CREATE POLICY "Authenticated users can manage addresses" ON addresses
  FOR ALL TO authenticated
  USING (true);

-- Subjects policies - Public read access
CREATE POLICY "Anyone can read subjects" ON subjects
  FOR SELECT TO authenticated
  USING (true);

-- Simplified policies for other tables
CREATE POLICY "Authenticated users can read requests" ON requests
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage own data" ON request_subjects
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage applications" ON applications
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage messages" ON messages
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read transactions" ON transactions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor profiles" ON tutors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tutor data" ON tutors
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor subjects" ON tutor_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tutor subjects" ON tutor_subjects
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor availability" ON tutor_availability
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage availability" ON tutor_availability
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage sessions" ON sessions
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage notifications" ON notifications
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage files" ON file_uploads
  FOR ALL TO authenticated
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update tutor stats
CREATE OR REPLACE FUNCTION update_tutor_stats()
RETURNS TRIGGER AS $$
BEGIN
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
    IF EXISTS (
      SELECT 1 FROM tutors 
      WHERE user_id = NEW.id 
      AND hourly_rate > 0 
      AND education IS NOT NULL
    ) THEN
      completion_percentage := completion_percentage + 20;
    END IF;
  ELSE
    IF EXISTS (SELECT 1 FROM requests WHERE user_id = NEW.id) THEN
      completion_percentage := completion_percentage + 20;
    END IF;
  END IF;
  
  NEW.profile_completion_percentage := completion_percentage;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_user_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tutors_updated_at
  BEFORE UPDATE ON tutors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_tutor_stats
  AFTER UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_tutor_stats();

CREATE TRIGGER trigger_calculate_profile_completion
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completion();

-- Insert sample subjects
INSERT INTO subjects (name, description, category) VALUES
  ('Mathematics', 'Algebra, Calculus, Geometry, Statistics', 'STEM'),
  ('English', 'Literature, Writing, Grammar, Reading Comprehension', 'Language Arts'),
  ('Science', 'Physics, Chemistry, Biology, Earth Science', 'STEM'),
  ('History', 'World History, American History, European History', 'Social Studies'),
  ('Computer Science', 'Programming, Data Structures, Algorithms, Web Development', 'STEM'),
  ('Languages', 'Spanish, French, German, Chinese, Japanese', 'Language Arts'),
  ('Art', 'Drawing, Painting, Digital Art, Art History', 'Arts'),
  ('Music', 'Piano, Guitar, Voice, Music Theory', 'Arts'),
  ('Business', 'Economics, Accounting, Marketing, Management', 'Business'),
  ('Psychology', 'General Psychology, Developmental Psychology, Social Psychology', 'Social Sciences'),
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

-- Create view for tutor search
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

-- Enable Row Level Security (but keep policies simple to avoid recursion)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Simplified to avoid recursion)

-- Users policies - Use email-based authentication
CREATE POLICY "Users can manage own data" ON users
  FOR ALL TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Addresses policies - Allow authenticated users to manage addresses
CREATE POLICY "Authenticated users can manage addresses" ON addresses
  FOR ALL TO authenticated
  USING (true);

-- Subjects policies - Public read access
CREATE POLICY "Anyone can read subjects" ON subjects
  FOR SELECT TO authenticated
  USING (true);

-- Simplified policies for other tables
CREATE POLICY "Authenticated users can read requests" ON requests
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage own data" ON request_subjects
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage applications" ON applications
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage messages" ON messages
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read transactions" ON transactions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor profiles" ON tutors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tutor data" ON tutors
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor subjects" ON tutor_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tutor subjects" ON tutor_subjects
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Anyone can read tutor availability" ON tutor_availability
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage availability" ON tutor_availability
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage sessions" ON sessions
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage notifications" ON notifications
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage files" ON file_uploads
  FOR ALL TO authenticated
  USING (true);

COMMENT ON VIEW tutor_search_view IS 'Optimized view for tutor search and listing pages';
