-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Links Table (Stores the QR codes/Apps)
create table public.links (
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

-- Clicks Table (Analytics)
create table public.clicks (
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

-- Storage Buckets (Documentation)
-- You need to create these buckets in Supabase Storage:
-- 1. 'logos' (Public)
-- 2. 'screenshots' (Public)

-- Row Level Security (RLS) Policies

-- Links: Users can only see and edit their own links
alter table public.links enable row level security;

create policy "Users can view their own links"
  on public.links for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own links"
  on public.links for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own links"
  on public.links for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own links"
  on public.links for delete
  using ( auth.uid() = user_id );

-- Public access for the landing page (fetching link data)
create policy "Public can view links via ID"
  on public.links for select
  using ( true );

-- Clicks: Public can insert clicks (when they scan), Users view analytics
alter table public.clicks enable row level security;

create policy "Public can insert clicks"
  on public.clicks for insert
  with check ( true );

create policy "Users can view clicks for their links"
  on public.clicks for select
  using (
    exists (
      select 1 from public.links
      where public.links.id = public.clicks.link_id
      and public.links.user_id = auth.uid()
    )
  );
