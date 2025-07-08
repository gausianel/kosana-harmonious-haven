
-- Create kosts table to support multiple boarding houses
CREATE TABLE public.kosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  facilities TEXT[], -- Array of facilities
  images TEXT[], -- Array of image URLs
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add kost relationship to rooms table
ALTER TABLE public.rooms ADD COLUMN kost_id UUID REFERENCES public.kosts(id);

-- Create reviews table for testimonials and ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  kost_id UUID REFERENCES public.kosts(id) NOT NULL,
  room_id BIGINT REFERENCES public.rooms(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for kosts table
ALTER TABLE public.kosts ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage their own kosts
CREATE POLICY "Owners can manage their own kosts" 
  ON public.kosts 
  FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Everyone can view kosts
CREATE POLICY "Everyone can view kosts" 
  ON public.kosts 
  FOR SELECT 
  USING (true);

-- Enable RLS for reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create reviews
CREATE POLICY "Users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view all reviews
CREATE POLICY "Everyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

-- Policy: Users can update/delete their own reviews
CREATE POLICY "Users can manage their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update rooms table policies to work with kosts
DROP POLICY IF EXISTS "Everyone can view rooms" ON public.rooms;
CREATE POLICY "Everyone can view rooms" 
  ON public.rooms 
  FOR SELECT 
  USING (true);

-- Add policy for owners to manage rooms in their kosts
CREATE POLICY "Owners can manage rooms in their kosts" 
  ON public.rooms 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.kosts 
      WHERE kosts.id = rooms.kost_id 
      AND kosts.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kosts 
      WHERE kosts.id = rooms.kost_id 
      AND kosts.owner_id = auth.uid()
    )
  );
