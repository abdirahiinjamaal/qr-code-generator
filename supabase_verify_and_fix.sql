-- =====================================
-- STEP 1: CHECK YOUR CURRENT STATUS
-- =====================================
-- Run this first to see if you're already an admin
SELECT 
    u.email,
    COALESCE(ur.is_admin, false) as is_admin,
    ur.created_at as admin_since
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.id
WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
   OR u.email LIKE '%@%'  -- Shows all users if you're not logged in
ORDER BY u.created_at DESC;

-- =====================================
-- STEP 2: VERIFY DATABASE STRUCTURE
-- =====================================
-- Check if all required columns exist
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'links'
  AND column_name IN ('logo_url', 'description', 'show_ios', 'show_android', 'show_web')
ORDER BY column_name;

-- Check clicks table has source column
SELECT 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'clicks'
  AND column_name = 'source';

-- =====================================
-- STEP 3: MAKE YOURSELF ADMIN
-- =====================================
-- ⚠️ IMPORTANT: Replace 'YOUR_EMAIL_HERE' with your actual login email
-- Example: 'john@example.com'

-- This will either insert you as admin or update your existing record
INSERT INTO public.user_roles (id, is_admin)
SELECT 
    id, 
    true 
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE'  -- 👈 CHANGE THIS!
ON CONFLICT (id) 
DO UPDATE SET is_admin = true;

-- =====================================
-- STEP 4: VERIFY IT WORKED
-- =====================================
-- Run this to confirm you're now an admin
SELECT 
    u.email,
    ur.is_admin,
    ur.created_at as admin_since
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.id
WHERE ur.is_admin = true;
