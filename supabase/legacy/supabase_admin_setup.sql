-- Add is_admin column to auth.users metadata
-- Run this in Supabase SQL Editor

-- Step 1: Create a custom users table to track admin status
create table if not exists public.user_roles (
  id uuid references auth.users primary key,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Step 2: Enable RLS
alter table public.user_roles enable row level security;

-- Step 3: Policy to allow users to read their own role
create policy "Users can view own role"
  on public.user_roles for select
  using (auth.uid() = id);

-- Step 4: Create a function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Step 5: Update links table policy to only allow admins to create
drop policy if exists "Users can create their own links" on public.links;
create policy "Only admins can create links"
  on public.links for insert
  with check (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );

-- Step 6: Create your first admin user (REPLACE WITH YOUR EMAIL)
-- After you create an account, run this to make yourself admin:
-- insert into public.user_roles (id, is_admin)
-- select id, true from auth.users where email = 'your-email@example.com'
-- on conflict (id) do update set is_admin = true;
