-- 1. First, ensure the table exists and has the correct policies
create table if not exists public.user_roles (
  id uuid references auth.users primary key,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_roles enable row level security;

-- Drop existing policy to avoid conflicts if re-running
drop policy if exists "Users can view own role" on public.user_roles;

create policy "Users can view own role"
  on public.user_roles for select
  using (auth.uid() = id);

-- 2. CRITICAL: Make YOURSELF an admin
-- Replace 'YOUR_EMAIL_HERE' with your actual login email address
-- Example: 'abdirahiin@example.com'

insert into public.user_roles (id, is_admin)
select id, true 
from auth.users 
-- 👇👇👇 REPLACE THIS EMAIL BELOW 👇👇👇
where email = 'YOUR_EMAIL_HERE' 
-- 👆👆👆 REPLACE THIS EMAIL ABOVE 👆👆👆
on conflict (id) do update set is_admin = true;

-- 3. Verify it worked
select * from public.user_roles;
