
-- Update bookings table to add DP functionality
ALTER TABLE public.bookings 
ADD COLUMN dp_percentage INTEGER DEFAULT 30,
ADD COLUMN dp_amount BIGINT,
ADD COLUMN payment_type TEXT DEFAULT 'booking' CHECK (payment_type IN ('booking', 'direct')),
ADD COLUMN booking_notes TEXT,
ADD COLUMN kost_id UUID REFERENCES public.kosts(id) ON DELETE CASCADE;

-- Create payments table for direct payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id BIGINT REFERENCES public.rooms(id) ON DELETE CASCADE,
  kost_id UUID REFERENCES public.kosts(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  payment_type TEXT DEFAULT 'direct' CHECK (payment_type IN ('direct', 'dp', 'full')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  payment_method TEXT,
  transaction_id TEXT,
  payment_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
  ON public.payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" 
  ON public.payments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view payments for their kosts" 
  ON public.payments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.kosts 
    WHERE kosts.id = payments.kost_id 
    AND kosts.owner_id = auth.uid()
  ));

-- Create trigger for payments table
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON public.payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
