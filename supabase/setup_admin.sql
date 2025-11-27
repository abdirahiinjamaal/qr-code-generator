-- ================================================================================
-- ADMIN SETUP SCRIPT
-- ================================================================================
-- Run this in Supabase SQL Editor to make yourself an admin
-- Replace 'YOUR-EMAIL@EXAMPLE.COM' with your actual email address

-- Step 1: Check if you exist in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'YOUR-EMAIL@EXAMPLE.COM';

-- Step 2: Make yourself an admin (run this AFTER replacing the email)
INSERT INTO public.user_roles (id, is_admin)
SELECT id, true 
FROM auth.users 
WHERE email = 'YOUR-EMAIL@EXAMPLE.COM'
ON CONFLICT (id) 
DO UPDATE SET is_admin = true;

-- Step 3: Verify you're now an admin
SELECT 
    u.email,
    ur.is_admin,
    ur.created_at as admin_since
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.id
WHERE u.email = 'YOUR-EMAIL@EXAMPLE.COM';

-- ================================================================================
-- Optional: View all current admins
-- ================================================================================
SELECT 
    u.email,
    ur.is_admin,
    ur.created_at as admin_since
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.id
WHERE ur.is_admin = true
ORDER BY ur.created_at;

-- ================================================================================
-- TROUBLESHOOTING
-- ================================================================================

-- If you see "no rows returned" in Step 1, you need to create an account first:
-- 1. Go to your app's login page
-- 2. (The signup is removed, but you can create users in Supabase dashboard)
-- 3. Go to Supabase Dashboard → Authentication → Users → "Add User"
-- 4. Create a user with your email
-- 5. Then run this script again

-- If Step 2 fails with a permission error:
-- Make sure you're running this in Supabase SQL Editor (not the app)
-- and you're logged in as the database owner

-- If Step 3 shows is_admin = false:
-- Double-check you replaced YOUR-EMAIL@EXAMPLE.COM with your actual email
-- Make sure there are no typos in the email address
