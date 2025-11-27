-- Add description column to links table
-- Run this in Supabase SQL Editor

alter table public.links 
add column description text default 'Kala soo Deg Appka Caawiye Playstoreka ama App Storeka';
