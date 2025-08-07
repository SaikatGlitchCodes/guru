-- SQL functions for tutor-jobs coin deduction system
-- These should be added to your Supabase database

-- Function to handle contacting student and deducting coins
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
  result JSON;
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

-- Function to increment view count for requests
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

-- Create contact_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_email TEXT NOT NULL REFERENCES users(email),
  request_id UUID NOT NULL REFERENCES requests(id),
  coin_cost INTEGER NOT NULL,
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add view_count column to requests if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requests' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE requests ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_activities_tutor_email ON contact_activities(tutor_email);
CREATE INDEX IF NOT EXISTS idx_contact_activities_request_id ON contact_activities(request_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_contacted_at ON contact_activities(contacted_at);
CREATE INDEX IF NOT EXISTS idx_requests_view_count ON requests(view_count);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION contact_student_deduct_coins TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO authenticated;
GRANT ALL ON contact_activities TO authenticated;
