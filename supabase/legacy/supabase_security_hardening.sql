-- ==============================================================================
-- 🔒 SUPABASE SECURITY HARDENING SCRIPT
-- ==============================================================================
-- Run this script to patch vulnerabilities and secure your application.

-- 1. SECURE USER_ROLES (PREVENT PRIVILEGE ESCALATION)
-- ------------------------------------------------------------------------------
-- Revoke all write access to user_roles from the public/authenticated roles.
-- Only the service_role (server-side) or database admin should modify this.

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_roles;

-- Allow users to READ their own role (essential for the UI to know if you're admin)
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = id);

-- ⛔ BLOCK ALL WRITES from the API
-- We do this by simply NOT creating any INSERT/UPDATE/DELETE policies for 'public' or 'authenticated'.
-- This effectively makes the table READ-ONLY for your frontend application.


-- 2. SECURE STORAGE (PREVENT UNAUTHORIZED UPLOADS)
-- ------------------------------------------------------------------------------
-- Only Admins should be able to upload logos.

-- Drop existing policies that might be too open
DROP POLICY IF EXISTS "Any authenticated user can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload logos" ON storage.objects;

-- Create a secure policy for uploads
CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'logos' AND
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);

-- Allow public to view logos (essential for the scanner page)
CREATE POLICY "Public can view logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'logos' );

-- Allow admins to delete/update logos
CREATE POLICY "Admins can update/delete logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'logos' AND
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'logos' AND
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);


-- 3. SECURE CLICKS (DATA INTEGRITY)
-- ------------------------------------------------------------------------------
-- Ensure clicks are only recorded for valid links.

ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert clicks (needed for tracking), BUT enforce foreign key constraints
-- This is handled by the database schema (REFERENCES public.links(id)), but let's ensure RLS doesn't block it.

DROP POLICY IF EXISTS "Anyone can track clicks" ON public.clicks;

CREATE POLICY "Anyone can track clicks"
ON public.clicks FOR INSERT
WITH CHECK (true); 
-- Note: The Foreign Key constraint on 'link_id' prevents inserting clicks for non-existent links.


-- 4. SECURE LINKS (PREVENT UNAUTHORIZED MODIFICATION)
-- ------------------------------------------------------------------------------
-- Double check that only admins can modify links.

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can create links" ON public.links;
DROP POLICY IF EXISTS "Only admins can update links" ON public.links;
DROP POLICY IF EXISTS "Only admins can delete links" ON public.links;

-- Insert
CREATE POLICY "Only admins can create links"
ON public.links FOR INSERT
WITH CHECK (
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);

-- Update
CREATE POLICY "Only admins can update links"
ON public.links FOR UPDATE
USING (
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);

-- Delete
CREATE POLICY "Only admins can delete links"
ON public.links FOR DELETE
USING (
  (SELECT is_admin FROM public.user_roles WHERE id = auth.uid()) = true
);

-- Read (Public needs to read for redirection, Admin needs to read for dashboard)
DROP POLICY IF EXISTS "Public read access" ON public.links;
CREATE POLICY "Public read access"
ON public.links FOR SELECT
USING (true);


-- 5. FUNCTION SECURITY
-- ------------------------------------------------------------------------------
-- Ensure the helper function is secure
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres),
-- allowing it to bypass RLS on user_roles if needed (though we allowed read access anyway).

