-- Create a storage bucket for logos
-- Run this in Supabase SQL Editor

-- Create bucket
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true);

-- Allow authenticated users to upload logos
create policy "Authenticated users can upload logos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'logos');

-- Allow public read access to logos
create policy "Public can view logos"
on storage.objects for select
to public
using (bucket_id = 'logos');

-- Allow users to delete their own logos
create policy "Users can delete their own logos"
on storage.objects for delete
to authenticated
using (bucket_id = 'logos');
