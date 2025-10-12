-- Add category field to bookings table for NOC applications
ALTER TABLE public.bookings 
ADD COLUMN noc_category TEXT;

-- Add payment fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT;