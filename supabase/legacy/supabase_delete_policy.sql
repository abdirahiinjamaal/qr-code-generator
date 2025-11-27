-- Add delete functionality for links
-- Run this in Supabase SQL Editor

-- Step 1: Update foreign key to cascade delete clicks when link is deleted
alter table public.clicks 
  drop constraint clicks_link_id_fkey,
  add constraint clicks_link_id_fkey 
    foreign key (link_id) 
    references public.links(id) 
    on delete cascade;

-- Step 2: Add delete policy for links (only admins can delete)
create policy "Only admins can delete links"
  on public.links for delete
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );

-- Optional: Add update policy if you want to edit links later
create policy "Only admins can update links"
  on public.links for update
  using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and is_admin = true
    )
  );
