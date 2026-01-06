-- Add columns for creative image and description to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS creative_image_url TEXT,
ADD COLUMN IF NOT EXISTS creative_description TEXT;

-- Create storage bucket for booking creatives
INSERT INTO storage.buckets (id, name, public) 
VALUES ('booking-creatives', 'booking-creatives', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own creatives
CREATE POLICY "Users can upload their own creatives"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'booking-creatives' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to creatives
CREATE POLICY "Anyone can view creatives"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-creatives');

-- Allow users to update their own creatives
CREATE POLICY "Users can update their own creatives"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'booking-creatives'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own creatives
CREATE POLICY "Users can delete their own creatives"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'booking-creatives'
  AND auth.uid()::text = (storage.foldername(name))[1]
);