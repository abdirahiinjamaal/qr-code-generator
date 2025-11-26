-- Add platform visibility toggles to links table
-- Run this in Supabase SQL Editor

alter table public.links 
add column show_ios boolean default true,
add column show_android boolean default true,
add column show_web boolean default true;
