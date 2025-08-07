-- Quick SQL Fix for Tutor Contact System
-- Run this directly in your Supabase SQL Editor

-- 1. Add view_count column to requests table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. Create contact_activities table
CREATE TABLE IF NOT EXISTS contact_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_email TEXT NOT NULL,
  request_id UUID NOT NULL,
  coin_cost INTEGER NOT NULL,
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (tutor_email) REFERENCES users(email),
  FOREIGN KEY (request_id) REFERENCES requests(id)
);

-- 3. Function to handle contacting student and deducting coins
CREATE OR REPLACE FUNCTION contact_student_deduct_coins(
  tutor_email TEXT,
  request_id UUID,
  coin_cost INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current coin balance
  SELECT coin_balance INTO current_balance 
  FROM users 
  WHERE email = tutor_email;
  
  -- Check if user exists
  IF current_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check if user has enough coins
  IF current_balance < coin_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient coins');
  END IF;
  
  -- Deduct coins from tutor
  UPDATE users 
  SET coin_balance = coin_balance - coin_cost,
      updated_at = NOW()
  WHERE email = tutor_email;
  
  -- Record the contact activity
  INSERT INTO contact_activities (
    tutor_email,
    request_id,
    coin_cost,
    contacted_at
  ) VALUES (
    tutor_email,
    request_id,
    coin_cost,
    NOW()
  );
  
  -- Return success
  RETURN json_build_object(
    'success', true, 
    'message', 'Contact initiated successfully',
    'remaining_balance', current_balance - coin_cost
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 4. Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(request_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update view count
  UPDATE requests 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = request_id;
  
  -- Return success
  RETURN json_build_object('success', true, 'message', 'View count incremented');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_activities_tutor_email ON contact_activities(tutor_email);
CREATE INDEX IF NOT EXISTS idx_contact_activities_request_id ON contact_activities(request_id);
CREATE INDEX IF NOT EXISTS idx_requests_view_count ON requests(view_count);

-- 6. Enable Row Level Security (optional but recommended)
ALTER TABLE contact_activities ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for contact_activities
CREATE POLICY "Users can view their own contact activities" ON contact_activities
  FOR SELECT USING (auth.email() = tutor_email);

CREATE POLICY "Users can insert their own contact activities" ON contact_activities
  FOR INSERT WITH CHECK (auth.email() = tutor_email);

-- Success message
SELECT 'Tutor contact system setup completed successfully!' as message;
