
-- Create bookings table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id BIGINT REFERENCES public.rooms(id) ON DELETE CASCADE,
  kost_id UUID REFERENCES public.kosts(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status_payment TEXT DEFAULT 'pending' CHECK (status_payment IN ('pending', 'confirmed', 'cancelled')),
  total_amount BIGINT NOT NULL,
  booking_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view bookings for their kosts" 
  ON public.bookings 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.kosts 
    WHERE kosts.id = bookings.kost_id 
    AND kosts.owner_id = auth.uid()
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add images array to rooms table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rooms' AND column_name = 'images'
  ) THEN
    ALTER TABLE public.rooms ADD COLUMN images TEXT[];
  END IF;
END $$;
