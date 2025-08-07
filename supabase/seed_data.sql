/*
  # Seed Data for Mentoring Platform
  
  This file contains sample data to populate the database for development and testing
*/

-- Insert sample users (tutors)
INSERT INTO users (id, email, name, role, phone_number, bio, avatar_url, address_id, email_verified, phone_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@example.com', 'Sarah Johnson', 'tutor', '+1234567890', 'Experienced math tutor with PhD in Applied Mathematics. Specializing in calculus and algebra.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', null, true, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'michael.chen@example.com', 'Michael Chen', 'tutor', '+1234567891', 'Senior software engineer turned tutor. Expert in Python, JavaScript, and web development.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', null, true, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'emily.rodriguez@example.com', 'Emily Rodriguez', 'tutor', '+1234567892', 'English professor with expertise in creative writing and literature analysis.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', null, true, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'david.kim@example.com', 'David Kim', 'tutor', '+1234567893', 'Medical student with strong background in sciences. Patient and encouraging teaching style.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', null, true, true),
  ('550e8400-e29b-41d4-a716-446655440005', 'lisa.thompson@example.com', 'Lisa Thompson', 'tutor', '+1234567894', 'Native Spanish speaker with certification in language teaching. Fluent in 4 languages.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', null, true, true),
  ('550e8400-e29b-41d4-a716-446655440006', 'robert.wilson@example.com', 'Robert Wilson', 'tutor', '+1234567895', 'Former investment banker with MBA. Specializes in business strategy and financial analysis.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', null, true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample addresses
INSERT INTO addresses (id, street, city, state, country, formatted) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '123 Main St', 'New York', 'NY', 'USA', '123 Main St, New York, NY, USA'),
  ('550e8400-e29b-41d4-a716-446655440102', '456 Oak Ave', 'San Francisco', 'CA', 'USA', '456 Oak Ave, San Francisco, CA, USA'),
  ('550e8400-e29b-41d4-a716-446655440103', '789 Pine Rd', 'Austin', 'TX', 'USA', '789 Pine Rd, Austin, TX, USA'),
  ('550e8400-e29b-41d4-a716-446655440104', '321 Elm St', 'Boston', 'MA', 'USA', '321 Elm St, Boston, MA, USA'),
  ('550e8400-e29b-41d4-a716-446655440105', '654 Palm Dr', 'Miami', 'FL', 'USA', '654 Palm Dr, Miami, FL, USA'),
  ('550e8400-e29b-41d4-a716-446655440106', '987 Lake Ave', 'Chicago', 'IL', 'USA', '987 Lake Ave, Chicago, IL, USA')
ON CONFLICT (id) DO NOTHING;

-- Update users with addresses
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440101' WHERE email = 'sarah.johnson@example.com';
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440102' WHERE email = 'michael.chen@example.com';
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440103' WHERE email = 'emily.rodriguez@example.com';
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440104' WHERE email = 'david.kim@example.com';
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440105' WHERE email = 'lisa.thompson@example.com';
UPDATE users SET address_id = '550e8400-e29b-41d4-a716-446655440106' WHERE email = 'robert.wilson@example.com';

-- Insert tutor profiles
INSERT INTO tutors (id, user_id, hourly_rate, experience_years, education, languages, response_time, availability_status, verified, preferred_meeting_types) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 45, 5, 'PhD in Applied Mathematics from MIT', ARRAY['English'], '< 1 hour', 'available', true, ARRAY['online', 'offline']),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 60, 7, 'MS Computer Science from Stanford', ARRAY['English', 'Mandarin'], '< 2 hours', 'available', true, ARRAY['online']),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 40, 8, 'PhD in English Literature from Harvard', ARRAY['English', 'Spanish'], '< 30 min', 'available', true, ARRAY['online', 'offline']),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 35, 4, 'MD from Johns Hopkins (in progress)', ARRAY['English', 'Korean'], '< 3 hours', 'available', true, ARRAY['online', 'offline']),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 38, 6, 'BA in Spanish Literature, TESOL Certification', ARRAY['Spanish', 'English', 'French', 'Portuguese'], '< 1 hour', 'available', true, ARRAY['online', 'offline', 'travel']),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 55, 10, 'MBA from Wharton, CFA', ARRAY['English'], '< 4 hours', 'available', true, ARRAY['online', 'offline'])
ON CONFLICT (user_id) DO NOTHING;

-- Get subject IDs for tutor_subjects associations
DO $$
DECLARE
    math_id uuid;
    physics_id uuid;
    cs_id uuid;
    programming_id uuid;
    english_id uuid;
    literature_id uuid;
    chemistry_id uuid;
    biology_id uuid;
    spanish_id uuid;
    french_id uuid;
    business_id uuid;
    economics_id uuid;
BEGIN
    -- Get subject IDs
    SELECT id INTO math_id FROM subjects WHERE name = 'Mathematics';
    SELECT id INTO physics_id FROM subjects WHERE name = 'Physics';
    SELECT id INTO cs_id FROM subjects WHERE name = 'Computer Science';
    SELECT id INTO programming_id FROM subjects WHERE name = 'Programming';
    SELECT id INTO english_id FROM subjects WHERE name = 'English';
    SELECT id INTO literature_id FROM subjects WHERE name = 'Literature';
    SELECT id INTO chemistry_id FROM subjects WHERE name = 'Chemistry';
    SELECT id INTO biology_id FROM subjects WHERE name = 'Biology';
    SELECT id INTO spanish_id FROM subjects WHERE name = 'Spanish';
    SELECT id INTO french_id FROM subjects WHERE name = 'French';
    SELECT id INTO business_id FROM subjects WHERE name = 'Business';
    SELECT id INTO economics_id FROM subjects WHERE name = 'Economics';

    -- Insert tutor-subject associations
    -- Sarah Johnson - Mathematics, Physics
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440001', math_id, 'expert', 5),
      ('660e8400-e29b-41d4-a716-446655440001', physics_id, 'expert', 5)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;

    -- Michael Chen - Computer Science, Programming
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440002', cs_id, 'expert', 7),
      ('660e8400-e29b-41d4-a716-446655440002', programming_id, 'expert', 7)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;

    -- Emily Rodriguez - English, Literature
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440003', english_id, 'expert', 8),
      ('660e8400-e29b-41d4-a716-446655440003', literature_id, 'expert', 8)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;

    -- David Kim - Chemistry, Biology
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440004', chemistry_id, 'advanced', 4),
      ('660e8400-e29b-41d4-a716-446655440004', biology_id, 'advanced', 4)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;

    -- Lisa Thompson - Spanish, French
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440005', spanish_id, 'expert', 6),
      ('660e8400-e29b-41d4-a716-446655440005', french_id, 'advanced', 6)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;

    -- Robert Wilson - Business, Economics
    INSERT INTO tutor_subjects (tutor_id, subject_id, proficiency_level, years_experience) VALUES
      ('660e8400-e29b-41d4-a716-446655440006', business_id, 'expert', 10),
      ('660e8400-e29b-41d4-a716-446655440006', economics_id, 'expert', 10)
    ON CONFLICT (tutor_id, subject_id) DO NOTHING;
END $$;

-- Update user ratings and review counts to match the sample data
UPDATE users SET rating = 4.9, total_reviews = 127 WHERE email = 'sarah.johnson@example.com';
UPDATE users SET rating = 4.8, total_reviews = 89 WHERE email = 'michael.chen@example.com';
UPDATE users SET rating = 4.9, total_reviews = 156 WHERE email = 'emily.rodriguez@example.com';
UPDATE users SET rating = 4.7, total_reviews = 73 WHERE email = 'david.kim@example.com';
UPDATE users SET rating = 4.8, total_reviews = 92 WHERE email = 'lisa.thompson@example.com';
UPDATE users SET rating = 4.6, total_reviews = 45 WHERE email = 'robert.wilson@example.com';

-- Add some sample availability for tutors (Monday to Friday, 9 AM to 5 PM)
INSERT INTO tutor_availability (tutor_id, day_of_week, start_time, end_time, timezone) VALUES
  -- Sarah Johnson
  ('660e8400-e29b-41d4-a716-446655440001', 1, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440001', 2, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440001', 3, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440001', 4, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440001', 5, '09:00', '17:00', 'America/New_York'),
  
  -- Michael Chen
  ('660e8400-e29b-41d4-a716-446655440002', 1, '10:00', '18:00', 'America/Los_Angeles'),
  ('660e8400-e29b-41d4-a716-446655440002', 2, '10:00', '18:00', 'America/Los_Angeles'),
  ('660e8400-e29b-41d4-a716-446655440002', 3, '10:00', '18:00', 'America/Los_Angeles'),
  ('660e8400-e29b-41d4-a716-446655440002', 4, '10:00', '18:00', 'America/Los_Angeles'),
  ('660e8400-e29b-41d4-a716-446655440002', 5, '10:00', '18:00', 'America/Los_Angeles'),
  
  -- Emily Rodriguez
  ('660e8400-e29b-41d4-a716-446655440003', 1, '08:00', '16:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440003', 2, '08:00', '16:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440003', 3, '08:00', '16:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440003', 4, '08:00', '16:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440003', 5, '08:00', '16:00', 'America/Chicago'),
  
  -- David Kim (more flexible schedule as student)
  ('660e8400-e29b-41d4-a716-446655440004', 1, '14:00', '20:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440004', 2, '14:00', '20:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440004', 3, '14:00', '20:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440004', 4, '14:00', '20:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440004', 6, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440004', 0, '09:00', '17:00', 'America/New_York'),
  
  -- Lisa Thompson
  ('660e8400-e29b-41d4-a716-446655440005', 1, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440005', 2, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440005', 3, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440005', 4, '09:00', '17:00', 'America/New_York'),
  ('660e8400-e29b-41d4-a716-446655440005', 5, '09:00', '17:00', 'America/New_York'),
  
  -- Robert Wilson (business hours)
  ('660e8400-e29b-41d4-a716-446655440006', 1, '09:00', '17:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440006', 2, '09:00', '17:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440006', 3, '09:00', '17:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440006', 4, '09:00', '17:00', 'America/Chicago'),
  ('660e8400-e29b-41d4-a716-446655440006', 5, '09:00', '17:00', 'America/Chicago')
ON CONFLICT DO NOTHING;

-- Add some sample reviews to establish ratings
INSERT INTO reviews (reviewer_id, reviewee_id, rating, comment) VALUES
  -- Reviews for Sarah Johnson
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, 'Excellent math tutor! Really helped me understand calculus concepts.'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 5, 'Very patient and knowledgeable. Highly recommended.'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 4, 'Great explanations, helped me ace my physics exam.'),
  
  -- Reviews for Michael Chen
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 5, 'Amazing programming mentor. Learned so much about web development.'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 5, 'Clear explanations and practical examples. Worth every penny.'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 4, 'Very knowledgeable in computer science fundamentals.'),
  
  -- Reviews for Emily Rodriguez
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 5, 'Fantastic English tutor. Improved my writing significantly.'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 5, 'Helped me with literature analysis. Very insightful.'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 5, 'Patient and encouraging. Made literature enjoyable.')
ON CONFLICT (reviewer_id, reviewee_id, request_id) DO NOTHING;

-- Update tutor statistics
UPDATE tutors SET 
  total_sessions = FLOOR(RANDOM() * 100) + 20,
  success_rate = 85 + (RANDOM() * 15),
  response_rate = 90 + (RANDOM() * 10),
  instant_booking = CASE WHEN RANDOM() > 0.5 THEN true ELSE false END;

COMMENT ON TABLE tutors IS 'Extended tutor profiles with platform-specific information';
COMMENT ON TABLE tutor_subjects IS 'Many-to-many relationship between tutors and subjects they teach';
COMMENT ON TABLE tutor_availability IS 'Tutor availability schedules for booking sessions';
COMMENT ON TABLE sessions IS 'Individual tutoring sessions between students and tutors';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE file_uploads IS 'File storage metadata for user uploads';
