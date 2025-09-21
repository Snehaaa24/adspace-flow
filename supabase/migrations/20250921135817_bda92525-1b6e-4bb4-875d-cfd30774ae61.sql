-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'owner');

-- Create enum for billboard traffic scores
CREATE TYPE public.traffic_score AS ENUM ('low', 'medium', 'high', 'premium');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  company_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billboards table
CREATE TABLE public.billboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  width_feet INTEGER NOT NULL,
  height_feet INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  traffic_score traffic_score NOT NULL DEFAULT 'medium',
  daily_impressions INTEGER DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  billboard_id UUID NOT NULL REFERENCES public.billboards(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  creative_url TEXT,
  campaign_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table (grouping multiple bookings)
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_budget DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add campaign_id to bookings table
ALTER TABLE public.bookings ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_billboards_location ON public.billboards (latitude, longitude);
CREATE INDEX idx_billboards_owner ON public.billboards (owner_id);
CREATE INDEX idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX idx_bookings_billboard ON public.bookings (billboard_id);
CREATE INDEX idx_bookings_dates ON public.bookings (start_date, end_date);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Billboards policies
CREATE POLICY "Everyone can view available billboards" ON public.billboards
FOR SELECT USING (is_available = true);

CREATE POLICY "Owners can view their own billboards" ON public.billboards
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

CREATE POLICY "Owners can insert billboards" ON public.billboards
FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id AND role = 'owner'));

CREATE POLICY "Owners can update their own billboards" ON public.billboards
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

CREATE POLICY "Owners can delete their own billboards" ON public.billboards
FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

-- Bookings policies
CREATE POLICY "Customers can view their own bookings" ON public.bookings
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id));

CREATE POLICY "Owners can view bookings for their billboards" ON public.bookings
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.profiles p WHERE p.id IN (SELECT b.owner_id FROM public.billboards b WHERE b.id = billboard_id)));

CREATE POLICY "Customers can create bookings" ON public.bookings
FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id AND role = 'customer'));

CREATE POLICY "Customers can update their own bookings" ON public.bookings
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id));

CREATE POLICY "Owners can update bookings for their billboards" ON public.bookings
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.profiles p WHERE p.id IN (SELECT b.owner_id FROM public.billboards b WHERE b.id = billboard_id)));

-- Campaigns policies
CREATE POLICY "Customers can view their own campaigns" ON public.campaigns
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id));

CREATE POLICY "Customers can create campaigns" ON public.campaigns
FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id AND role = 'customer'));

CREATE POLICY "Customers can update their own campaigns" ON public.campaigns
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id));

CREATE POLICY "Customers can delete their own campaigns" ON public.campaigns
FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = customer_id));

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billboards_updated_at
BEFORE UPDATE ON public.billboards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('billboard-images', 'billboard-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-creatives', 'campaign-creatives', false);

-- Storage policies for billboard images
CREATE POLICY "Anyone can view billboard images" ON storage.objects
FOR SELECT USING (bucket_id = 'billboard-images');

CREATE POLICY "Owners can upload billboard images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'billboard-images' AND auth.role() = 'authenticated');

CREATE POLICY "Owners can update their billboard images" ON storage.objects
FOR UPDATE USING (bucket_id = 'billboard-images' AND auth.role() = 'authenticated');

-- Storage policies for campaign creatives
CREATE POLICY "Users can view their own campaign creatives" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own campaign creatives" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own campaign creatives" ON storage.objects
FOR UPDATE USING (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);