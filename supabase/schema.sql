-- ==============================================================================
-- 🚀 QR CODE GENERATOR - COMPLETE DATABASE SCHEMA
-- ==============================================================================
-- This file contains the entire database structure, security policies, and 
-- helper functions for the application.
--
-- TABLES:
-- 1. public.links       - Stores QR code data (URLs, title, settings)
-- 2. public.clicks      - Stores analytics data (clicks, location, platform)
-- 3. public.user_roles  - Stores user permissions (Admin vs Regular)
--
-- SECURITY:
-- - Row Level Security (RLS) is ENABLED on all tables.
-- - Only 'Admins' can create/edit links.
-- - Public can read links (for redirection).
-- - Public can insert clicks (for analytics).
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1. USER ROLES (Admin System)
create table if not exists public.user_roles (
  id uuid references auth.users primary key,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.2. LINKS (QR Codes)
create table if not exists public.links (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  
  -- Platform URLs
  ios_url text,
  android_url text,
  web_url text,
  
  -- Visibility Toggles
  show_ios boolean default true,
  show_android boolean default true,
  show_web boolean default true,
  
  -- Assets & Metadata
  logo_url text,
  screenshots text[] default array[]::text[],
  rating numeric(2,1) default 0,
  review_count integer default 0
);

-- 2.3. CLICKS (Analytics)
create table if not exists public.clicks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  link_id uuid references public.links on delete cascade not null,
  
  -- Analytics Data
  platform text, -- 'ios', 'android', 'web'
  source text,   -- 'tiktok', 'instagram', 'direct', etc.
  country text,
  city text,
  user_agent text
);

-- ==============================================================================
-- 3. HELPER FUNCTIONS
-- ==============================================================================

-- Function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 4.1. USER_ROLES SECURITY
alter table public.user_roles enable row level security;

-- Allow users to read their own role
create policy "Users can view own role"
  on public.user_roles for select
  using (auth.uid() = id);

-- 4.2. LINKS SECURITY
alter table public.links enable row level security;

-- Public can read links (needed for the landing page redirection)
create policy "Public read access"
  on public.links for select
  using (true);

-- Only Admins can create links
create policy "Only admins can create links"
  on public.links for insert
  with check (
    (select is_admin from public.user_roles where id = auth.uid()) = true
  );

-- Only Admins can update their own links
create policy "Only admins can update own links"
  on public.links for update
  using (
    (select is_admin from public.user_roles where id = auth.uid()) = true
    and auth.uid() = user_id
  );

-- Only Admins can delete their own links
create policy "Only admins can delete own links"
  on public.links for delete
  using (
    (select is_admin from public.user_roles where id = auth.uid()) = true
    and auth.uid() = user_id
  );

-- 4.3. CLICKS SECURITY
alter table public.clicks enable row level security;

-- Public can insert clicks (when they scan a QR code)
create policy "Public can insert clicks"
  on public.clicks for insert
  with check (true);

-- Only Admins can view clicks (Analytics)
create policy "Admins can view clicks"
  on public.clicks for select
  using (
    (select is_admin from public.user_roles where id = auth.uid()) = true
    and exists (
      select 1 from public.links
      where public.links.id = public.clicks.link_id
      and public.links.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 5. STORAGE BUCKETS (Documentation)
-- ==============================================================================
-- You must create these buckets in the Supabase Dashboard -> Storage

-- Bucket: 'logos' (Public)
-- Policy: Give INSERT/UPDATE/DELETE access to Admins only.
-- Policy: Give SELECT access to Public.

-- Bucket: 'screenshots' (Public)
-- Policy: Give INSERT/UPDATE/DELETE access to Admins only.
-- Policy: Give SELECT access to Public.

-- ==============================================================================
-- 6. INITIAL SETUP (Run this manually)
-- ==============================================================================
-- To make yourself the first admin, run this SQL after signing up:
-- 
-- insert into public.user_roles (id, is_admin)
-- select id, true from auth.users where email = 'YOUR_EMAIL@EXAMPLE.COM'
-- on conflict (id) do update set is_admin = true;
