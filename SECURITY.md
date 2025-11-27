# 🔒 Security Configuration

## Admin-Only Access

The QR code generator has been secured for **admin-only access**. Here's what has been implemented:

### Changes Made

#### 1. Login Page (`/login`)
- ✅ **Signup Removed**: Users can no longer create new accounts
- ✅ **Login Only**: Page now shows "Admin Login" with clear messaging
- ✅ **Warning Notice**: Yellow info box explaining admin-only access
- ✅ **Toast Notifications**: Replaced alerts with toast messages

#### 2. Main Generator Page (`/`)
- ✅ **Authentication Check**: Redirects to login if not authenticated
- ✅ **Admin Authorization**: Blocks non-admin users even if logged in
- ✅ **Loading State**: Shows loading spinner while checking auth
- ✅ **Access Denied Screen**: Professional error page for unauthorized users
- ✅ **Auto Redirect**: Non-admins are automatically sent to login

### How It Works

```
┌─────────────┐
│   User      │
│  Visits /   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Check if logged in  │
└──────┬──────────────┘
       │
       ├─── No ──→ Redirect to /login
       │
       ▼ Yes
┌─────────────────────┐
│  Check if admin     │
└──────┬──────────────┘
       │
       ├─── No ──→ Show "Access Denied" screen
       │
       ▼ Yes
┌─────────────────────┐
│ Show QR Generator   │
└─────────────────────┘
```

## Creating Admin Users

### Option 1: Database SQL (Recommended)
Run this in your Supabase SQL Editor after a user is created:

```sql
-- Replace with the actual email
insert into public.user_roles (id, is_admin)
select id, true from auth.users 
where email = 'admin@example.com'
on conflict (id) do update set is_admin = true;
```

### Option 2: Manual Database Entry
1. Go to Supabase Dashboard
2. Navigate to Table Editor → `user_roles`
3. Insert a new row:
   - `id`: Copy from `auth.users` table
   - `is_admin`: `true`
   - `created_at`: Auto-filled

## Security Layers

### Layer 1: Frontend Protection
- React components check `isAdmin` state
- Non-admins see "Access Denied" screen
- Automatic redirects prevent unauthorized access

### Layer 2: Backend Protection (Database RLS)
The database has Row Level Security policies that ensure:
- Only admins can INSERT links
- Only admins can UPDATE/DELETE their links
- Public can SELECT (view) links for redirection
- Admins can view their analytics

### Layer 3: API Protection
The `handleSubmit` in `useGenerator` hook checks:
```typescript
if (!isAdmin) {
    toast.error('⛔ Access Denied: Only administrators can create QR codes.')
    return
}
```

## Protected Routes

| Route | Access Level | Behavior |
|-------|-------------|----------|
| `/` (Generator) | **Admin Only** | Redirects non-admins to login |
| `/dashboard` | **Admin Only** | Already protected |
| `/create` | **Admin Only** | Already protected |
| `/login` | **Public** | Anyone can view (login only) |
| `/l/[id]` (Landing) | **Public** | Anyone can scan QR codes |

## Testing Security

### Test 1: Unauthenticated User
1. Clear cookies/logout
2. Try to visit `/`
3. ✅ Should redirect to `/login`

### Test 2: Non-Admin User
1. Login with a non-admin account
2. Try to visit `/`
3. ✅ Should see "Access Denied" screen

### Test 3: Admin User
1. Login with an admin account
2. Visit `/`
3. ✅ Should see the QR generator

## Maintenance Notes

### Adding New Admins
1. User must first be created in Supabase Auth
2. Run the SQL command to grant admin privileges
3. User can then login and access the generator

### Revoking Admin Access
```sql
update public.user_roles 
set is_admin = false 
where id = (
    select id from auth.users 
    where email = 'user@example.com'
);
```

### Checking Current Admins
```sql
select 
    u.email,
    ur.is_admin,
    ur.created_at
from auth.users u
join public.user_roles ur on u.id = ur.id
where ur.is_admin = true;
```

## User Experience

### For Admins
- Login at `/login`
- Access full QR generator
- See dashboard button in header
- Can create, edit, and delete links
- Can view analytics

### For Non-Admins
- Login page shows "Admin Access Only" warning
- Cannot create accounts (signup removed)
- If somehow logged in, see professional "Access Denied" page
- Clear messaging about admin-only access

## Best Practices

1. **Keep Admin List Small**: Only give admin access to trusted users
2. **Use Strong Passwords**: Require complex passwords for admin accounts
3. **Monitor Access**: Check Supabase auth logs regularly
4. **Backup Database**: Regular backups of `user_roles` table
5. **Audit Admins**: Periodically review who has admin access

## Troubleshooting

### "Access Denied" for Admin User
1. Check `user_roles` table in Supabase
2. Ensure `is_admin = true` for that user
3. Try logging out and back in
4. Clear browser cache/cookies

### Can't Login
1. Verify email/password are correct
2. Check Supabase Auth logs
3. Ensure user exists in `auth.users` table
4. Check if email is verified (if required)

### Page Keeps Redirecting
1. Check browser console for errors
2. Verify Supabase connection
3. Check `is_admin` value in database
4. Try incognito mode

---

**Security Status**: 🔒 **Fully Secured**
- ✅ Signup disabled
- ✅ Login-only mode
- ✅ Admin-only generator access
- ✅ Database-level protection
- ✅ Frontend protection
- ✅ Clear error messaging
