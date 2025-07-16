
-- Create function to handle direct payments
CREATE OR REPLACE FUNCTION create_direct_payment(
  p_user_id UUID,
  p_room_id BIGINT,
  p_kost_id UUID,
  p_amount BIGINT,
  p_payment_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payment_id UUID;
BEGIN
  INSERT INTO public.payments (
    user_id,
    room_id,
    kost_id,
    amount,
    payment_type,
    payment_notes,
    status
  )
  VALUES (
    p_user_id,
    p_room_id,
    p_kost_id,
    p_amount,
    'direct',
    p_payment_notes,
    'pending'
  )
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$;
