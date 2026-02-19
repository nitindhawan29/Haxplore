-- Fix missing tables and policies for deposits and profiles

-- 1. Ensure Profiles Table Exists
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  display_name text,
  points int DEFAULT 0,
  co2_saved_kg numeric DEFAULT 0,
  badges jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- 2. Ensure Deposits Table Exists
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  bin_id uuid, -- Keeping loose reference for MVP if foreign key fails
  detected_type text,
  confidence real,
  estimated_value numeric(10,2),
  image_url text,
  weight_grams int,
  timestamp timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Profiles
-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (for lazy creation)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Policies for Deposits
-- Allow users to view their own deposits
DROP POLICY IF EXISTS "Users can view own deposits" ON deposits;
CREATE POLICY "Users can view own deposits" ON deposits
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert deposits
DROP POLICY IF EXISTS "Users can insert own deposits" ON deposits;
CREATE POLICY "Users can insert own deposits" ON deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Grant usage to anon/authenticated for MVP (Optional, but good for local dev)
GRANT ALL ON profiles TO anon, authenticated, service_role;
GRANT ALL ON deposits TO anon, authenticated, service_role;
