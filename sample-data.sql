-- Sample Data for Tutoring Platform Development
-- Run this after your schema is set up

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM session_participants;
-- DELETE FROM sessions;
-- DELETE FROM reviews;
-- DELETE FROM applications;
-- DELETE FROM messages;
-- DELETE FROM contact_activities;
-- DELETE FROM availability_slots;
-- DELETE FROM tutor_availability;
-- DELETE FROM tutor_subjects;
-- DELETE FROM user_subjects;
-- DELETE FROM request_subjects;
-- DELETE FROM requests;
-- DELETE FROM payment_transactions;
-- DELETE FROM payments;
-- DELETE FROM transactions;
-- DELETE FROM notifications;
-- DELETE FROM file_uploads;
-- DELETE FROM user_preferences;
-- DELETE FROM tutors;
-- DELETE FROM users;
-- DELETE FROM subjects;
-- DELETE FROM addresses;

-- Sample Addresses
INSERT INTO addresses (id, street, city, state, zip, country, country_code, lat, lon, formatted) VALUES
('a1111111-1111-1111-1111-111111111111', '123 Main St', 'New York', 'NY', '10001', 'United States', 'US', 40.7128, -74.0060, '123 Main St, New York, NY 10001, USA'),
('a2222222-2222-2222-2222-222222222222', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'United States', 'US', 34.0522, -118.2437, '456 Oak Ave, Los Angeles, CA 90210, USA'),
('a3333333-3333-3333-3333-333333333333', '789 Pine Rd', 'Chicago', 'IL', '60601', 'United States', 'US', 41.8781, -87.6298, '789 Pine Rd, Chicago, IL 60601, USA'),
('a4444444-4444-4444-4444-444444444444', '321 Elm St', 'Houston', 'TX', '77001', 'United States', 'US', 29.7604, -95.3698, '321 Elm St, Houston, TX 77001, USA'),
('a5555555-5555-5555-5555-555555555555', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'United States', 'US', 33.4484, -112.0740, '654 Maple Dr, Phoenix, AZ 85001, USA'),
('a6666666-6666-6666-6666-666666666666', '987 Cedar Ln', 'Philadelphia', 'PA', '19101', 'United States', 'US', 39.9526, -75.1652, '987 Cedar Ln, Philadelphia, PA 19101, USA'),
('a7777777-7777-7777-7777-777777777777', '147 Birch St', 'San Antonio', 'TX', '78201', 'United States', 'US', 29.4241, -98.4936, '147 Birch St, San Antonio, TX 78201, USA'),
('a8888888-8888-8888-8888-888888888888', '258 Spruce Ave', 'San Diego', 'CA', '92101', 'United States', 'US', 32.7157, -117.1611, '258 Spruce Ave, San Diego, CA 92101, USA'),
('a9999999-9999-9999-9999-999999999999', '369 Willow Rd', 'Dallas', 'TX', '75201', 'United States', 'US', 32.7767, -96.7970, '369 Willow Rd, Dallas, TX 75201, USA'),
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '741 Aspen Dr', 'San Jose', 'CA', '95101', 'United States', 'US', 37.3382, -121.8863, '741 Aspen Dr, San Jose, CA 95101, USA');

-- Sample Subjects
INSERT INTO subjects (id, name, description, category, icon, difficulty_level, hourly_rate_min, hourly_rate_max, is_active) VALUES
('s1111111-1111-1111-1111-111111111111', 'Mathematics', 'Algebra, Calculus, Statistics, and more', 'STEM', '📊', 'beginner', 25, 80, true),
('s2222222-2222-2222-2222-222222222222', 'Physics', 'Mechanics, Thermodynamics, Quantum Physics', 'STEM', '⚛️', 'intermediate', 30, 90, true),
('s3333333-3333-3333-3333-333333333333', 'Chemistry', 'Organic, Inorganic, Physical Chemistry', 'STEM', '🧪', 'intermediate', 28, 85, true),
('s4444444-4444-4444-4444-444444444444', 'Computer Science', 'Programming, Data Structures, Algorithms', 'STEM', '💻', 'advanced', 40, 120, true),
('s5555555-5555-5555-5555-555555555555', 'English Literature', 'Essay Writing, Literature Analysis, Grammar', 'Humanities', '📚', 'beginner', 20, 60, true),
('s6666666-6666-6666-6666-666666666666', 'History', 'World History, American History, Ancient Civilizations', 'Humanities', '🏛️', 'beginner', 22, 65, true),
('s7777777-7777-7777-7777-777777777777', 'Biology', 'Cell Biology, Genetics, Ecology', 'STEM', '🔬', 'intermediate', 26, 75, true),
('s8888888-8888-8888-8888-888888888888', 'Spanish', 'Conversational Spanish, Grammar, Literature', 'Language', '🇪🇸', 'beginner', 18, 55, true),
('s9999999-9999-9999-9999-999999999999', 'French', 'Conversational French, Grammar, Culture', 'Language', '🇫🇷', 'beginner', 18, 55, true),
('saaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Economics', 'Microeconomics, Macroeconomics, Finance', 'Business', '💰', 'intermediate', 30, 85, true),
('sbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Psychology', 'Cognitive Psychology, Social Psychology, Research Methods', 'Social Science', '🧠', 'intermediate', 25, 70, true),
('scccccc1-cccc-cccc-cccc-cccccccccccc', 'Art', 'Drawing, Painting, Digital Art, Art History', 'Arts', '🎨', 'beginner', 20, 60, true);

-- Sample Users (Mix of students and tutors)
INSERT INTO users (id, email, name, role, phone_number, gender, bio, years_of_experience, status, coin_balance, avatar_url, rating, total_reviews, address_id, timezone, preferred_language, profile_completion_percentage, email_verified, phone_verified, government_id_verified) VALUES
-- Students
('u1111111-1111-1111-1111-111111111111', 'student1@example.com', 'Alice Johnson', 'student', '+1-555-0101', 'female', 'Computer Science major looking for help with advanced mathematics and programming.', 0, 'active', 150, 'https://images.unsplash.com/photo-1494790108755-2616b9c5a0d5?w=100&h=100&fit=crop&crop=face', 0, 0, 'a1111111-1111-1111-1111-111111111111', 'America/New_York', 'English', 85, true, true, false),
('u2222222-2222-2222-2222-222222222222', 'student2@example.com', 'Bob Smith', 'student', '+1-555-0102', 'male', 'High school senior preparing for college entrance exams.', 0, 'active', 200, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 0, 0, 'a2222222-2222-2222-2222-222222222222', 'America/Los_Angeles', 'English', 75, true, false, false),
('u3333333-3333-3333-3333-333333333333', 'student3@example.com', 'Carol Davis', 'student', '+1-555-0103', 'female', 'Medical student needing help with organic chemistry and biology.', 0, 'active', 100, 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop&crop=face', 0, 0, 'a3333333-3333-3333-3333-333333333333', 'America/Chicago', 'English', 90, true, true, false),

-- Tutors
('u4444444-4444-4444-4444-444444444444', 'tutor1@example.com', 'Dr. Michael Chen', 'tutor', '+1-555-0201', 'male', 'PhD in Mathematics with 8 years of teaching experience. Specializes in calculus, linear algebra, and statistics.', 8, 'active', 50, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 4.8, 124, 'a4444444-4444-4444-4444-444444444444', 'America/Chicago', 'English', 95, true, true, true),
('u5555555-5555-5555-5555-555555555555', 'tutor2@example.com', 'Sarah Wilson', 'tutor', '+1-555-0202', 'female', 'Computer Science graduate with industry experience. Expert in Python, JavaScript, and data structures.', 5, 'active', 75, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 4.9, 87, 'a5555555-5555-5555-5555-555555555555', 'America/Phoenix', 'English', 98, true, true, true),
('u6666666-6666-6666-6666-666666666666', 'tutor3@example.com', 'Prof. James Rodriguez', 'tutor', '+1-555-0203', 'male', 'Former university professor with 12 years experience teaching Physics and Chemistry.', 12, 'active', 25, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', 4.7, 156, 'a6666666-6666-6666-6666-666666666666', 'America/New_York', 'English', 100, true, true, true),
('u7777777-7777-7777-7777-777777777777', 'tutor4@example.com', 'Emma Thompson', 'tutor', '+1-555-0204', 'female', 'English Literature major with tutoring experience. Passionate about writing and literary analysis.', 3, 'active', 100, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face', 4.6, 45, 'a7777777-7777-7777-7777-777777777777', 'America/Chicago', 'English', 88, true, true, false),
('u8888888-8888-8888-8888-888888888888', 'tutor5@example.com', 'Carlos Mendez', 'tutor', '+1-555-0205', 'male', 'Native Spanish speaker with teaching certification. Also fluent in French and Portuguese.', 6, 'active', 60, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 4.9, 78, 'a8888888-8888-8888-8888-888888888888', 'America/Los_Angeles', 'Spanish', 92, true, true, true),
('u9999999-9999-9999-9999-999999999999', 'tutor6@example.com', 'Dr. Lisa Park', 'tutor', '+1-555-0206', 'female', 'PhD in Biology with research background in genetics. Experienced in teaching all levels of biology.', 10, 'active', 30, 'https://images.unsplash.com/photo-1494790108755-2616b9c5a0e5?w=100&h=100&fit=crop&crop=face', 4.8, 134, 'a9999999-9999-9999-9999-999999999999', 'America/Phoenix', 'English', 96, true, true, true),
('uaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tutor7@example.com', 'David Kim', 'tutor', '+1-555-0207', 'male', 'Economics professor with Wall Street experience. Expert in micro/macro economics and finance.', 7, 'active', 40, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face', 4.5, 67, 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'America/New_York', 'English', 90, true, false, true);

-- Sample Tutors (Extended profiles for users with role='tutor')
INSERT INTO tutors (id, user_id, hourly_rate, experience_years, education, certifications, languages, teaching_style, specializations, response_time, availability_status, verified, background_check, preferred_meeting_types, travel_radius_km, minimum_session_duration, instant_booking, total_sessions, total_earnings, success_rate, response_rate) VALUES
('t4444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', 65, 8, 'PhD Mathematics - Stanford University', '{"Teaching Certificate", "Mathematics Certification"}', '{"English", "Mandarin"}', 'Interactive problem-solving with real-world applications', '{"Calculus", "Linear Algebra", "Statistics", "SAT/ACT Prep"}', '< 2 hours', 'available', true, true, '{"online", "in-person"}', 15, 60, true, 342, 22230, 0.94, 0.98),
('t5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', 75, 5, 'MS Computer Science - MIT', '{"Google Cloud Certified", "AWS Certified"}', '{"English"}', 'Hands-on coding with practical projects', '{"Python", "JavaScript", "Data Structures", "Machine Learning"}', '< 4 hours', 'available', true, true, '{"online", "in-person"}', 10, 90, false, 215, 16125, 0.92, 0.95),
('t6666666-6666-6666-6666-666666666666', 'u6666666-6666-6666-6666-666666666666', 80, 12, 'PhD Physics - Harvard University', '{"Teaching Excellence Award", "Research Publication Certificate"}', '{"English", "Spanish"}', 'Conceptual understanding through demonstrations', '{"Quantum Physics", "Thermodynamics", "AP Physics", "Chemistry"}', '< 6 hours', 'available', true, true, '{"online", "in-person", "travel"}', 20, 60, false, 456, 36480, 0.89, 0.91),
('t7777777-7777-7777-7777-777777777777', 'u7777777-7777-7777-7777-777777777777', 45, 3, 'BA English Literature - Yale University', '{"TESOL Certificate"}', '{"English"}', 'Creative and analytical approach to literature', '{"Essay Writing", "Literary Analysis", "Creative Writing", "AP English"}', '< 12 hours', 'available', false, false, '{"online", "in-person"}', 8, 60, true, 123, 5535, 0.87, 0.89),
('t8888888-8888-8888-8888-888888888888', 'u8888888-8888-8888-8888-888888888888', 50, 6, 'BA Modern Languages - UC Berkeley', '{"Native Speaker Certificate", "DELE Certification"}', '{"Spanish", "English", "French", "Portuguese"}', 'Immersive conversation-based learning', '{"Conversational Spanish", "Business Spanish", "Spanish Literature"}', '< 3 hours', 'available', true, false, '{"online", "in-person"}', 12, 45, true, 287, 14350, 0.96, 0.97),
('t9999999-9999-9999-9999-999999999999', 'u9999999-9999-9999-9999-999999999999', 70, 10, 'PhD Biology - Johns Hopkins University', '{"Research Excellence Award", "NSF Grant Recipient"}', '{"English", "Korean"}', 'Research-based learning with lab demonstrations', '{"Genetics", "Molecular Biology", "AP Biology", "MCAT Prep"}', '< 4 hours', 'available', true, true, '{"online", "in-person"}', 18, 90, false, 398, 27860, 0.93, 0.94),
('taaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'uaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 85, 7, 'PhD Economics - Wharton School', '{"CFA Charter", "Financial Risk Manager"}', '{"English", "Korean"}', 'Real-world case studies and market analysis', '{"Microeconomics", "Macroeconomics", "Finance", "CFA Prep"}', '< 8 hours', 'busy', true, true, '{"online", "in-person"}', 25, 120, false, 189, 16065, 0.88, 0.85);

-- Sample Tutor Subjects (Many-to-many relationship)
INSERT INTO tutor_subjects (id, tutor_id, subject_id, proficiency_level, years_experience, hourly_rate_override) VALUES
-- Dr. Michael Chen - Mathematics
('ts111111-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 's1111111-1111-1111-1111-111111111111', 'expert', 8, null),
-- Sarah Wilson - Computer Science
('ts222222-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 's4444444-4444-4444-4444-444444444444', 'expert', 5, null),
('ts223333-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 's1111111-1111-1111-1111-111111111111', 'advanced', 3, 70),
-- Prof. James Rodriguez - Physics & Chemistry
('ts333333-3333-3333-3333-333333333333', 't6666666-6666-6666-6666-666666666666', 's2222222-2222-2222-2222-222222222222', 'expert', 12, null),
('ts334444-3333-3333-3333-333333333333', 't6666666-6666-6666-6666-666666666666', 's3333333-3333-3333-3333-333333333333', 'expert', 10, 85),
('ts335555-3333-3333-3333-333333333333', 't6666666-6666-6666-6666-666666666666', 's1111111-1111-1111-1111-111111111111', 'advanced', 8, 75),
-- Emma Thompson - English Literature
('ts444444-4444-4444-4444-444444444444', 't7777777-7777-7777-7777-777777777777', 's5555555-5555-5555-5555-555555555555', 'expert', 3, null),
('ts445555-4444-4444-4444-444444444444', 't7777777-7777-7777-7777-777777777777', 's6666666-6666-6666-6666-666666666666', 'intermediate', 2, 40),
-- Carlos Mendez - Spanish & French
('ts555555-5555-5555-5555-555555555555', 't8888888-8888-8888-8888-888888888888', 's8888888-8888-8888-8888-888888888888', 'expert', 6, null),
('ts556666-5555-5555-5555-555555555555', 't8888888-8888-8888-8888-888888888888', 's9999999-9999-9999-9999-999999999999', 'advanced', 4, 45),
-- Dr. Lisa Park - Biology
('ts666666-6666-6666-6666-666666666666', 't9999999-9999-9999-9999-999999999999', 's7777777-7777-7777-7777-777777777777', 'expert', 10, null),
('ts667777-6666-6666-6666-666666666666', 't9999999-9999-9999-9999-999999999999', 's3333333-3333-3333-3333-333333333333', 'advanced', 6, 75),
-- David Kim - Economics
('ts777777-7777-7777-7777-777777777777', 'taaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'saaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'expert', 7, null),
('ts778888-7777-7777-7777-777777777777', 'taaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 's1111111-1111-1111-1111-111111111111', 'advanced', 5, 80);

-- Sample Availability Slots
INSERT INTO availability_slots (id, tutor_id, day_of_week, start_time, end_time, timezone, is_active, recurring_weekly, max_sessions) VALUES
-- Dr. Michael Chen (Monday-Friday, 9 AM - 5 PM)
('as111111-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 1, '09:00:00', '17:00:00', 'America/Chicago', true, true, 3),
('as112222-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 2, '09:00:00', '17:00:00', 'America/Chicago', true, true, 3),
('as113333-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 3, '09:00:00', '17:00:00', 'America/Chicago', true, true, 3),
('as114444-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 4, '09:00:00', '17:00:00', 'America/Chicago', true, true, 3),
('as115555-1111-1111-1111-111111111111', 't4444444-4444-4444-4444-444444444444', 5, '09:00:00', '17:00:00', 'America/Chicago', true, true, 3),

-- Sarah Wilson (Evenings and weekends)
('as222222-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 1, '18:00:00', '22:00:00', 'America/Phoenix', true, true, 2),
('as223333-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 3, '18:00:00', '22:00:00', 'America/Phoenix', true, true, 2),
('as224444-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 5, '18:00:00', '22:00:00', 'America/Phoenix', true, true, 2),
('as225555-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 6, '10:00:00', '18:00:00', 'America/Phoenix', true, true, 4),
('as226666-2222-2222-2222-222222222222', 't5555555-5555-5555-5555-555555555555', 0, '12:00:00', '18:00:00', 'America/Phoenix', true, true, 3);

-- Sample Requests
INSERT INTO requests (id, user_id, address_id, title, description, type, level, status, price_amount, price_option, price_currency, price_currency_symbol, gender_preference, tutors_want, i_need_someone, language, online_meeting, offline_meeting, travel_meeting, urgency, view_count) VALUES
('r1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Help with Calculus II', 'I''m struggling with integration techniques and series. Need help preparing for midterm exam next week.', 'tutoring', 'intermediate', 'open', 45, 'per_hour', 'USD', '$', 'None', 'Only one', 'part time', '["English"]', true, true, false, 'urgent', 23),
('r2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'SAT Math Preparation', 'High school senior looking for comprehensive SAT math prep. Want to improve from 650 to 750+.', 'tutoring', 'beginner', 'open', 50, 'per_hour', 'USD', '$', 'None', 'Only one', 'part time', '["English"]', true, false, false, 'flexible', 41),
('r3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Organic Chemistry Assignment Help', 'Need help with mechanism problems and synthesis reactions. Have assignment due this Friday.', 'assignment', 'advanced', 'open', 35, 'per_hour', 'USD', '$', 'None', 'Only one', 'part time', '["English"]', true, true, false, 'urgent', 18),
('r4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Python Programming Mentorship', 'Computer science student looking for ongoing mentorship in Python, data structures, and algorithms.', 'tutoring', 'intermediate', 'open', 60, 'per_hour', 'USD', '$', 'None', 'Only one', 'part time', '["English"]', true, false, false, 'flexible', 67),
('r5555555-5555-5555-5555-555555555555', 'u2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Spanish Conversation Practice', 'Want to improve conversational Spanish skills. Planning to study abroad next semester.', 'tutoring', 'beginner', 'open', 30, 'per_hour', 'USD', '$', 'None', 'Only one', 'part time', '["English", "Spanish"]', true, true, false, 'flexible', 34);

-- Sample Request Subjects (Many-to-many)
INSERT INTO request_subjects (id, request_id, subject_id) VALUES
('rs111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'), -- Calculus II -> Mathematics
('rs222222-2222-2222-2222-222222222222', 'r2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111'), -- SAT Math -> Mathematics
('rs333333-3333-3333-3333-333333333333', 'r3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333'), -- Organic Chemistry -> Chemistry
('rs444444-4444-4444-4444-444444444444', 'r4444444-4444-4444-4444-444444444444', 's4444444-4444-4444-4444-444444444444'), -- Python Programming -> Computer Science
('rs555555-5555-5555-5555-555555555555', 'r5555555-5555-5555-5555-555555555555', 's8888888-8888-8888-8888-888888888888'); -- Spanish Conversation -> Spanish

-- Sample Applications
INSERT INTO applications (id, request_id, tutor_id, message, proposed_rate, status) VALUES
('ap111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', 'Hi Alice! I''d be happy to help you with Calculus II. I have extensive experience with integration techniques and series convergence. I can provide focused help for your midterm preparation.', 45, 'pending'),
('ap222222-2222-2222-2222-222222222222', 'r2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'Hello Bob! I specialize in SAT math prep and have helped many students achieve significant score improvements. I can create a customized study plan to get you to 750+.', 50, 'accepted'),
('ap333333-3333-3333-3333-333333333333', 'r3333333-3333-3333-3333-333333333333', 'u6666666-6666-6666-6666-666666666666', 'Hi Carol! As a former chemistry professor, I can definitely help with organic mechanisms and synthesis. I''m available for urgent help this week.', 40, 'pending'),
('ap444444-4444-4444-4444-444444444444', 'r4444444-4444-4444-4444-444444444444', 'u5555555-5555-5555-5555-555555555555', 'Hello! I''d love to mentor you in Python programming. With my industry experience, I can provide practical insights beyond just academic concepts.', 60, 'pending'),
('ap555555-5555-5555-5555-555555555555', 'r5555555-5555-5555-5555-555555555555', 'u8888888-8888-8888-8888-888888888888', '¡Hola! As a native Spanish speaker with teaching experience, I can help you become conversational before your study abroad. ¡Vamos a practicar!', 30, 'accepted');

-- Sample Messages
INSERT INTO messages (id, sender_id, recipient_id, request_id, content, message_type, read) VALUES
('m1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', 'r1111111-1111-1111-1111-111111111111', 'Thank you for applying! When would be a good time to start? I have my exam next Thursday.', 'text', true),
('m2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 'Great! I can start as early as tomorrow. How about we schedule 3 sessions this week - Monday, Wednesday, and Friday?', 'text', false),
('m3333333-3333-3333-3333-333333333333', 'u2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'r2222222-2222-2222-2222-222222222222', 'Perfect! I accept your application. What materials should I prepare for our first session?', 'text', true),
('m4444444-4444-4444-4444-444444444444', 'u5555555-5555-5555-5555-555555555555', 'u1111111-1111-1111-1111-111111111111', null, 'Hi Alice! I saw your profile and think I could help with your programming questions. Are you still looking for a mentor?', 'text', false),
('m5555555-5555-5555-5555-555555555555', 'u8888888-8888-8888-8888-888888888888', 'u2222222-2222-2222-2222-222222222222', 'r5555555-5555-5555-5555-555555555555', '¡Perfecto! We can start with basic conversations about daily life, then move to more complex topics. ¿Qué te parece?', 'text', false);

-- Sample Sessions
INSERT INTO sessions (id, student_id, tutor_id, request_id, subject_id, title, description, session_type, status, scheduled_start, scheduled_end, hourly_rate, total_amount, payment_status, notes) VALUES
('se111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'r2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'SAT Math Prep Session 1', 'Introduction to SAT math strategies and practice problems', 'online', 'completed', '2025-08-05 14:00:00-05', '2025-08-05 15:30:00-05', 50, 75, 'completed', 'Covered algebra and geometry basics. Student showed good understanding.'),
('se222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'u8888888-8888-8888-8888-888888888888', 'r5555555-5555-5555-5555-555555555555', 's8888888-8888-8888-8888-888888888888', 'Spanish Conversation - Session 1', 'Basic greetings and introductions in Spanish', 'online', 'scheduled', '2025-08-12 16:00:00-07', '2025-08-12 17:00:00-07', 30, 30, 'pending', null);

-- Sample Reviews
INSERT INTO reviews (id, reviewer_id, reviewee_id, request_id, rating, comment, helpful_count) VALUES
('rv111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'r2222222-2222-2222-2222-222222222222', 5, 'Dr. Chen is an excellent tutor! He explained complex concepts clearly and patiently. My SAT math score improved by 80 points after just 3 sessions.', 12),
('rv222222-2222-2222-2222-222222222222', 'u3333333-3333-3333-3333-333333333333', 'u6666666-6666-6666-6666-666666666666', null, 5, 'Professor Rodriguez helped me understand organic chemistry mechanisms that I was completely lost on. Highly recommend!', 8),
('rv333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'u5555555-5555-5555-5555-555555555555', null, 4, 'Sarah is great at breaking down programming concepts. She uses practical examples that make everything click.', 6);

-- Sample Payment Transactions
INSERT INTO payment_transactions (id, session_id, user_email, amount, coins, status, payment_method, metadata) VALUES
('pt111111-1111-1111-1111-111111111111', 'stripe_session_123', 'student1@example.com', 20000, 100, 'completed', 'stripe', '{"stripe_payment_intent": "pi_123", "coins_purchased": 100}'),
('pt222222-2222-2222-2222-222222222222', 'stripe_session_124', 'student2@example.com', 40000, 200, 'completed', 'stripe', '{"stripe_payment_intent": "pi_124", "coins_purchased": 200}'),
('pt333333-3333-3333-3333-333333333333', 'stripe_session_125', 'student3@example.com', 20000, 100, 'completed', 'stripe', '{"stripe_payment_intent": "pi_125", "coins_purchased": 100}');

-- Sample Transactions (Coin usage)
INSERT INTO transactions (id, user_id, type, amount, description, reference_id, status) VALUES
('tx111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'credit', 100, 'Coin purchase via Stripe', 'pt111111-1111-1111-1111-111111111111', 'completed'),
('tx222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'credit', 200, 'Coin purchase via Stripe', 'pt222222-2222-2222-2222-222222222222', 'completed'),
('tx333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'credit', 100, 'Coin purchase via Stripe', 'pt333333-3333-3333-3333-333333333333', 'completed'),
('tx444444-4444-4444-4444-444444444444', 'u2222222-2222-2222-2222-222222222222', 'debit', -75, 'Payment for SAT Math Prep Session', 'se111111-1111-1111-1111-111111111111', 'completed'),
('tx555555-5555-5555-5555-555555555555', 'u4444444-4444-4444-4444-444444444444', 'credit', 75, 'Earnings from SAT Math Prep Session', 'se111111-1111-1111-1111-111111111111', 'completed');

-- Sample Notifications
INSERT INTO notifications (id, user_id, type, title, message, related_id, related_type, read, priority) VALUES
('n1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'application', 'New Application', 'Dr. Michael Chen applied to your Calculus II request', 'ap111111-1111-1111-1111-111111111111', 'application', false, 'normal'),
('n2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'message', 'New Message', 'You have a new message from Alice Johnson', 'm1111111-1111-1111-1111-111111111111', 'message', false, 'normal'),
('n3333333-3333-3333-3333-333333333333', 'u2222222-2222-2222-2222-222222222222', 'session', 'Session Reminder', 'Your SAT Math Prep session starts in 1 hour', 'se222222-2222-2222-2222-222222222222', 'session', true, 'high'),
('n4444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', 'payment', 'Payment Received', 'You received $75 for completed session', 'se111111-1111-1111-1111-111111111111', 'session', false, 'normal'),
('n5555555-5555-5555-5555-555555555555', 'u2222222-2222-2222-2222-222222222222', 'review', 'New Review', 'Please leave a review for your completed session with Dr. Chen', 'se111111-1111-1111-1111-111111111111', 'session', false, 'low');

-- Sample User Preferences
INSERT INTO user_preferences (id, user_id, notification_email, notification_push, notification_sms, marketing_emails, auto_accept_sessions, preferred_session_duration, max_daily_sessions, weekend_availability) VALUES
('up111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', true, true, false, false, false, 60, 3, true),
('up222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', true, true, true, true, false, 90, 2, false),
('up333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', true, false, false, false, false, 60, 4, true),
('up444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', true, true, false, false, true, 90, 6, true),
('up555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', true, true, true, false, false, 120, 4, true);

-- Update user coin balances after transactions
UPDATE users SET coin_balance = 150 WHERE id = 'u1111111-1111-1111-1111-111111111111';
UPDATE users SET coin_balance = 125 WHERE id = 'u2222222-2222-2222-2222-222222222222';
UPDATE users SET coin_balance = 100 WHERE id = 'u3333333-3333-3333-3333-333333333333';
UPDATE users SET coin_balance = 125 WHERE id = 'u4444444-4444-4444-4444-444444444444'; -- 50 initial + 75 earnings

-- Final verification queries (uncomment to run)
-- SELECT 'Users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'Tutors', COUNT(*) FROM tutors
-- UNION ALL 
-- SELECT 'Subjects', COUNT(*) FROM subjects
-- UNION ALL
-- SELECT 'Requests', COUNT(*) FROM requests
-- UNION ALL
-- SELECT 'Applications', COUNT(*) FROM applications
-- UNION ALL
-- SELECT 'Sessions', COUNT(*) FROM sessions
-- UNION ALL
-- SELECT 'Messages', COUNT(*) FROM messages
-- UNION ALL
-- SELECT 'Reviews', COUNT(*) FROM reviews;

-- Sample query to test tutor search functionality
-- SELECT 
--   t.id, t.hourly_rate, t.experience_years, t.verified,
--   u.name, u.bio, u.rating, u.total_reviews, u.avatar_url,
--   a.city, a.state,
--   array_agg(s.name) as subjects
-- FROM tutors t
-- JOIN users u ON t.user_id = u.id
-- LEFT JOIN addresses a ON u.address_id = a.id  
-- LEFT JOIN tutor_subjects ts ON t.id = ts.tutor_id
-- LEFT JOIN subjects s ON ts.subject_id = s.id
-- WHERE u.role = 'tutor' AND u.status = 'active'
-- GROUP BY t.id, u.id, a.id
-- ORDER BY u.rating DESC, u.total_reviews DESC;
