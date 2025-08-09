-- Create payment_transactions table to track all payment attempts and statuses
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  coins INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'cancelled', 'processing')),
  payment_method TEXT DEFAULT 'stripe',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_email ON payment_transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_session_id ON payment_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

-- Enable RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own payment transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
  FOR SELECT USING (user_email = auth.jwt() ->> 'email');

-- Only the application can insert payment records (not users directly)
CREATE POLICY "Service can insert payment transactions" ON payment_transactions
  FOR INSERT WITH CHECK (true);

-- Only the application can update payment records
CREATE POLICY "Service can update payment transactions" ON payment_transactions
  FOR UPDATE USING (true);

-- Update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_transactions_updated_at 
  BEFORE UPDATE ON payment_transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
