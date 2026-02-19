-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- REFERENCES auth.users(id) in real app, simplified for demo
  display_name text,
  points int DEFAULT 0,
  badges jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  lat double precision,
  lng double precision,
  accepts text[],
  fill_percent int DEFAULT 0,
  status text DEFAULT 'operational', -- 'operational', 'full', 'maintenance'
  last_updated timestamptz DEFAULT now()
);

-- Deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  bin_id uuid REFERENCES bins(id),
  detected_type text,
  confidence real,
  estimated_value numeric(10,2),
  image_url text,
  weight_grams int,
  timestamp timestamptz DEFAULT now()
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id serial PRIMARY KEY,
  title text,
  cost_points int,
  active boolean DEFAULT true,
  image_url text
);
