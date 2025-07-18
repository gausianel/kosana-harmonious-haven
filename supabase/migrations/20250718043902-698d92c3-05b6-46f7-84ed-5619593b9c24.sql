
-- Add support for multiple images per room by updating the rooms table
-- Change the image column from text to text array to support multiple images
ALTER TABLE public.rooms 
DROP COLUMN IF EXISTS image;

ALTER TABLE public.rooms 
ADD COLUMN images TEXT[];

-- Create storage bucket for room images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images', 
  'room-images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for room images bucket
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'room-images');

CREATE POLICY "Allow authenticated users to upload room images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'room-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow room owners to update their room images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'room-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow room owners to delete their room images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'room-images' 
  AND auth.role() = 'authenticated'
);
