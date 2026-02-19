-- Seed Bins
INSERT INTO bins (name, lat, lng, accepts, fill_percent, status) VALUES
('MG Road Bin 01', 18.5204, 73.8567, ARRAY['battery', 'phone', 'charger'], 20, 'operational'),
('College Gate Bin A', 18.5167, 73.8560, ARRAY['laptop', 'phone', 'cable'], 75, 'operational'),
('Community Center Bin B', 18.5220, 73.8590, ARRAY['battery', 'cable'], 95, 'full'),
('Tech Park Bin C', 18.5300, 73.8600, ARRAY['laptop', 'phone', 'battery', 'charger', 'cable'], 10, 'operational');

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
