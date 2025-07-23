/*
  # Complete Database Schema for Mentoring Platform

  1. New Tables
    - `users` - User profiles with authentication
    - `addresses` - Address information for users and requests
    - `subjects` - Available subjects for tutoring
    - `requests` - Tutor requests from students
    - `applications` - Tutor applications to requests
    - `messages` - Communication between users
    - `reviews` - Reviews and ratings
    - `transactions` - Payment and coin transactions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Relations
    - Foreign key constraints between all related tables
    - Proper indexing for performance
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

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_address FOREIGN KEY (address_id) REFERENCES addresses(id);
ALTER TABLE requests ADD CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE requests ADD CONSTRAINT fk_requests_address FOREIGN KEY (address_id) REFERENCES addresses(id);
ALTER TABLE request_subjects ADD CONSTRAINT fk_request_subjects_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE;
ALTER TABLE request_subjects ADD CONSTRAINT fk_request_subjects_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;
ALTER TABLE applications ADD CONSTRAINT fk_applications_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE;
ALTER TABLE applications ADD CONSTRAINT fk_applications_tutor FOREIGN KEY (tutor_id) REFERENCES users(id);
ALTER TABLE messages ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id);
ALTER TABLE messages ADD CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES users(id);
ALTER TABLE messages ADD CONSTRAINT fk_messages_request FOREIGN KEY (request_id) REFERENCES requests(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_request FOREIGN KEY (request_id) REFERENCES requests(id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id);

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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text OR auth.uid()::text IN (
    SELECT id::text FROM users WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text OR auth.uid()::text IN (
    SELECT id::text FROM users WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- RLS Policies for addresses table
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL TO authenticated
  USING (id IN (
    SELECT address_id FROM users WHERE auth.uid()::text = id::text
    UNION
    SELECT address_id FROM requests WHERE user_id::text = auth.uid()::text
  ));

-- RLS Policies for subjects table
CREATE POLICY "Anyone can read subjects" ON subjects
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for requests table
CREATE POLICY "Anyone can read open requests" ON requests
  FOR SELECT TO authenticated
  USING (status = 'open' OR user_id::text = auth.uid()::text);

CREATE POLICY "Users can manage own requests" ON requests
  FOR ALL TO authenticated
  USING (user_id::text = auth.uid()::text);

-- RLS Policies for request_subjects table
CREATE POLICY "Anyone can read request subjects" ON request_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own request subjects" ON request_subjects
  FOR ALL TO authenticated
  USING (request_id IN (
    SELECT id FROM requests WHERE user_id::text = auth.uid()::text
  ));

-- RLS Policies for applications table
CREATE POLICY "Users can read relevant applications" ON applications
  FOR SELECT TO authenticated
  USING (
    tutor_id::text = auth.uid()::text OR
    request_id IN (SELECT id FROM requests WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Tutors can manage own applications" ON applications
  FOR ALL TO authenticated
  USING (tutor_id::text = auth.uid()::text);

-- RLS Policies for messages table
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT TO authenticated
  USING (sender_id::text = auth.uid()::text OR recipient_id::text = auth.uid()::text);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id::text = auth.uid()::text);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id::text = auth.uid()::text);

-- RLS Policies for transactions table
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text);

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
  ('Psychology', 'General Psychology, Developmental Psychology, Social Psychology', 'Social Sciences')
ON CONFLICT (name) DO NOTHING;

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

-- Create trigger to automatically update user ratings
CREATE TRIGGER trigger_update_user_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
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