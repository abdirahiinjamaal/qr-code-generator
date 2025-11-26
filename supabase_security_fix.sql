-- CRITICAL SECURITY FIX
-- Run this IMMEDIATELY after supabase_admin_setup.sql

-- Step 1: Add policy to prevent non-admins from modifying user_roles
-- This prevents users from making themselves admin!

-- First, drop the existing read-only policy
drop policy if exists "Users can view own role" on public.user_roles;

-- Add comprehensive policies
create policy "Users can view own role"
  on public.user_roles for select
  using (auth.uid() = id);

create policy "Only admins can insert roles"
  on public.user_roles for insert
  with check (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Only admins can update roles"
  on public.user_roles for update
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Only admins can delete roles"
  on public.user_roles for delete
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );

-- Step 2: Improve clicks policy to prevent spam
drop policy if exists "Anyone can insert clicks" on public.clicks;

create policy "Can insert click for valid link"
  on public.clicks for insert
  with check (
    exists (
      select 1 from public.links
      where id = link_id
    )
  );
