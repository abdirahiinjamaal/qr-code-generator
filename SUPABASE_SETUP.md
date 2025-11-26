# 📋 Complete Supabase Setup Guide

## ⚠️ IMPORTANT: Run These SQL Scripts in Order

You need to run these SQL scripts in your **Supabase SQL Editor** to set up your database correctly.

### 🔐 Step 1: Admin Setup (CRITICAL)
**File:** `supabase_admin_setup.sql`

This creates the user roles system and restricts QR code creation to admins only.

```sql
-- Run this first to create the admin system
-- Then use supabase_fix_admin.sql to make yourself an admin
```

### 🛡️ Step 2: Fix Your Admin Status (DO THIS NOW)
**File:** `supabase_fix_admin.sql`

**ACTION REQUIRED:**
1. Open `supabase_fix_admin.sql`
2. Replace `'YOUR_EMAIL_HERE'` with your login email
3. Run the entire script in Supabase SQL Editor

This will fix the "Access Denied: Only administrators can create QR codes" error.

### 📸 Step 3: Logo Upload Support
**File:** `supabase_add_logo.sql`

Adds the `logo_url` column to store app logos in the QR codes.

### 📝 Step 4: Description Support
**File:** `supabase_add_description.sql`

Adds the `description` column for custom subtitles on scanner pages.

### 👁️ Step 5: Platform Visibility Toggles
**File:** `supabase_add_platform_toggles.sql`

Adds `show_ios`, `show_android`, `show_web` columns to control which platforms appear.

### 📊 Step 6: Traffic Source Tracking
**File:** `supabase_add_source_tracking.sql`

Adds the `source` column to track where clicks come from (TikTok, Facebook, etc.).

### 🗑️ Step 7: Delete Policies
**File:** `supabase_delete_policy.sql`

Sets up cascading deletes and admin-only delete/update permissions.

### 🔒 Step 8: Security Improvements
**File:** `supabase_security_fix.sql`

Hardens security policies to prevent unauthorized role changes.

### 🪣 Step 9: Storage Setup
**File:** `supabase_storage_setup.sql`

Creates the `logos` bucket for user-uploaded images with proper permissions.

---

## 🚀 Quick Start Checklist

- [ ] 1. Run `supabase_admin_setup.sql`
- [ ] 2. **Edit and run `supabase_fix_admin.sql`** (Replace your email!)
- [ ] 3. Run `supabase_add_logo.sql`
- [ ] 4. Run `supabase_add_description.sql`
- [ ] 5. Run `supabase_add_platform_toggles.sql`
- [ ] 6. Run `supabase_add_source_tracking.sql`
- [ ] 7. Run `supabase_delete_policy.sql`
- [ ] 8. Run `supabase_security_fix.sql`
- [ ] 9. Run `supabase_storage_setup.sql`

---

## 🎯 After Running These Scripts

Your app will have:
- ✅ Admin access (you can create QR codes)
- ✅ Logo upload functionality
- ✅ Platform visibility controls
- ✅ Traffic source tracking (TikTok, Facebook, etc.)
- ✅ Secure delete policies
- ✅ Proper storage permissions

---

## 🆘 Troubleshooting

**"Access Denied" Error?**
→ Run `supabase_fix_admin.sql` with YOUR email address

**Logo upload fails?**
→ Run `supabase_storage_setup.sql`

**Platform toggles not working?**
→ Run `supabase_add_platform_toggles.sql`

**Source tracking not showing?**
→ Run `supabase_add_source_tracking.sql`
