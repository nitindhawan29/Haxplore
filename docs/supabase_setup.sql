-- 1. Create Bins Table (if not exists)
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

-- 2. Enable Realtime triggers
ALTER PUBLICATION supabase_realtime ADD TABLE bins;

-- 3. Enable RLS (Security)
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Allow Public Access for Demo)
-- Allow anyone to read bins (User Map)
CREATE POLICY "Public Read Bins" ON bins 
  FOR SELECT USING (true);

-- Allow anyone to Insert/Update/Delete (Admin Dashboard)
-- IN PRODUCTION: You would lock this down to authenticated admins only!
CREATE POLICY "Public Write Bins" ON bins 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Update Bins" ON bins 
  FOR UPDATE USING (true);

CREATE POLICY "Public Delete Bins" ON bins 
  FOR DELETE USING (true);

-- 5. Insert Sample Data (Optional verification)
-- INSERT INTO bins (name, lat, lng, accepts) VALUES ('Test Bin', 23.25, 77.41, ARRAY['phone']);
