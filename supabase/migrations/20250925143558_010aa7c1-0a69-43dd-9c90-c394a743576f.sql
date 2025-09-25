-- Add NOC request status to bookings table
ALTER TABLE bookings 
ADD COLUMN noc_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN noc_status TEXT DEFAULT 'not_requested' CHECK (noc_status IN ('not_requested', 'pending', 'approved', 'rejected'));