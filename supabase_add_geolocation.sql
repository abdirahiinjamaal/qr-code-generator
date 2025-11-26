-- Add geolocation columns to the clicks table
ALTER TABLE public.clicks 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Create an index for faster analytics on country
CREATE INDEX IF NOT EXISTS idx_clicks_country ON public.clicks(country);
