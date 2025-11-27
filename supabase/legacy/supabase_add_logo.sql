-- Add logo_url column to links table
-- Run this in Supabase SQL Editor

alter table public.links 
add column logo_url text;
