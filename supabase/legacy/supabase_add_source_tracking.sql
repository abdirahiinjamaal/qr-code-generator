-- Add source column to clicks table for traffic tracking
-- Run this in Supabase SQL Editor

alter table public.clicks 
add column source text default 'direct';

-- Create an index for faster filtering by source
create index clicks_source_idx on public.clicks (source);
