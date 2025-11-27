-- Create links table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text,
  ios_url text,
  android_url text,
  web_url text
);

-- Create clicks table
create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  link_id uuid references public.links not null,
  platform text check (platform in ('ios', 'android', 'web')),
  user_agent text
);

-- Enable RLS
alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Policies for links
create policy "Users can create their own links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own links"
  on public.links for select
  using (auth.uid() = user_id);

create policy "Public read access for redirection"
  on public.links for select
  using (true);

-- Policies for clicks
create policy "Anyone can insert clicks"
  on public.clicks for insert
  with check (true);

create policy "Users can view clicks for their links"
  on public.clicks for select
  using (
    exists (
      select 1 from public.links
      where links.id = clicks.link_id
      and links.user_id = auth.uid()
    )
  );
