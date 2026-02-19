# Supabase Database Setup Guide

Your app is currently using **mock data** as a fallback. To use real Supabase data, follow these steps:

## Quick Fix Applied ✅

The app now works with mock data if the database is empty or fails. You'll see bins on the map even without database setup.

## To Use Real Supabase Database

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://vaextquiciqfwlfzvdgt.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Create Tables

Copy and paste this SQL to create the tables:

```sql
-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  status text DEFAULT 'operational',
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
```

Click **Run** to execute.

### Step 3: Add Sample Data

Copy and paste this SQL to add sample bins (adjust coordinates for your city):

```sql
-- Seed Bins (Bhopal, India coordinates)
INSERT INTO bins (name, lat, lng, accepts, fill_percent, status) VALUES
('MG Road Bin 01', 23.259933, 77.412613, ARRAY['battery', 'phone', 'charger'], 20, 'operational'),
('College Gate Bin A', 23.265933, 77.418613, ARRAY['laptop', 'phone', 'cable'], 75, 'operational'),
('Community Center Bin B', 23.255933, 77.408613, ARRAY['battery', 'cable'], 95, 'full'),
('Tech Park Bin C', 23.270933, 77.420613, ARRAY['laptop', 'phone', 'battery', 'charger', 'cable'], 10, 'operational');

-- Seed Users
INSERT INTO profiles (display_name, points, badges) VALUES
('Demo User', 120, '["Early Adopter"]'),
('Alice', 450, '["Super Recycler", "Battery Saver"]');

-- Seed Rewards
INSERT INTO rewards (title, cost_points, image_url) VALUES
('₹50 Amazon Voucher', 500, 'https://placehold.co/100x100?text=Amazon'),
('Movie Ticket', 300, 'https://placehold.co/100x100?text=Movie'),
('Coffee Coupon', 150, 'https://placehold.co/100x100?text=Coffee'),
('Plant a Tree', 1000, 'https://placehold.co/100x100?text=Tree');
```

Click **Run** to execute.

### Step 4: Enable Row Level Security (Optional but Recommended)

For production, enable RLS:

```sql
-- Enable RLS
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Allow public read access to bins and rewards
CREATE POLICY "Public bins read" ON bins FOR SELECT USING (true);
CREATE POLICY "Public rewards read" ON rewards FOR SELECT USING (true);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to insert deposits
CREATE POLICY "Users can insert deposits" ON deposits FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Step 5: Verify Data

Run this query to check if bins were added:

```sql
SELECT * FROM bins;
```

You should see 4 bins listed.

## Current Status

✅ **App works with mock data** - No database setup required for testing
✅ **API key configured** - OpenRouter AI is ready
✅ **Fallback system** - App gracefully handles database errors

## Troubleshooting

### "Error fetching bins: {}"

This means:
- Tables don't exist yet (run Step 2)
- Tables are empty (run Step 3)
- RLS is blocking access (run Step 4 or disable RLS temporarily)

### Check Your Connection

In browser console, you should see:
- ✅ "No bins found in database, using mock data" - Normal if database is empty
- ❌ "Error fetching bins: {...}" - Check Supabase credentials in `.env.local`

### Verify Environment Variables

Make sure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://vaextquiciqfwlfzvdgt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps

1. **For Development**: Keep using mock data (already working)
2. **For Production**: Set up real database following steps above
3. **Add More Bins**: Insert more rows with your actual bin locations

## Customizing Bin Locations

To add bins for your city, use this template:

```sql
INSERT INTO bins (name, lat, lng, accepts, fill_percent, status) VALUES
('Your Bin Name', YOUR_LATITUDE, YOUR_LONGITUDE, ARRAY['laptop', 'phone'], 50, 'operational');
```

Get coordinates from Google Maps:
1. Right-click on map location
2. Click on coordinates to copy
3. Format: (latitude, longitude)
