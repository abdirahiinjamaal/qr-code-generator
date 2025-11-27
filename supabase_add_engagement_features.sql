-- Add columns for App Screenshots and Social Proof to the 'links' table

-- 1. Add screenshots column (Array of URLs)
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS screenshots text[] DEFAULT '{}';

-- 2. Add Social Proof columns
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS rating numeric(2, 1) CHECK (rating >= 0 AND rating <= 5), -- e.g., 4.8
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0; -- e.g., 1200

-- 3. Create a storage bucket for screenshots if it doesn't exist (or ensure 'logos' bucket can be used, but a separate one is cleaner or just use 'public-assets')
-- For simplicity, we'll assume using the existing 'logos' bucket or a new 'screenshots' bucket. 
-- Let's create a new policy for a 'screenshots' folder inside the existing bucket if possible, or just a new bucket.
-- We'll try to insert a new bucket 'screenshots' just in case.

INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies for 'screenshots' bucket
-- Allow public access to view screenshots
DROP POLICY IF EXISTS "Public Access to Screenshots" ON storage.objects;
CREATE POLICY "Public Access to Screenshots"
ON storage.objects FOR SELECT
USING ( bucket_id = 'screenshots' );

-- Allow authenticated users to upload screenshots
DROP POLICY IF EXISTS "Authenticated users can upload screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can upload screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'screenshots' AND
  auth.role() = 'authenticated'
);

-- Allow users to update/delete their own screenshots
DROP POLICY IF EXISTS "Authenticated users can update screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can update screenshots"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'screenshots' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated users can delete screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can delete screenshots"
ON storage.objects FOR DELETE
USING ( bucket_id = 'screenshots' AND auth.role() = 'authenticated' );
