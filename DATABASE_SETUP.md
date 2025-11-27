# 🗄️ Database Setup & Security

This project uses **Supabase** (PostgreSQL) for the database and authentication.

## 📂 Schema File
The complete database schema is located at:
`supabase/schema.sql`

This file is the **Source of Truth**. It contains:
1.  **Table Definitions**: `links`, `clicks`, `user_roles`.
2.  **Security Policies (RLS)**: Strict rules on who can read/write data.
3.  **Functions**: Helper logic like `is_admin()`.

## 🚀 How to Setup

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Run the Schema**:
    *   Go to the **SQL Editor** in your Supabase dashboard.
    *   Copy the contents of `supabase/schema.sql`.
    *   Paste it into the editor and click **Run**.
3.  **Setup Storage**:
    *   Go to **Storage** in the dashboard.
    *   Create a new public bucket named `logos`.
    *   Create a new public bucket named `screenshots`.
    *   (The schema file describes the policies needed for these).

## 🛡️ Security Model

The application uses a strict **Admin-only** model for creating content.

*   **Public Users**:
    *   Can scan QR codes (read links).
    *   Can generate clicks (write analytics).
    *   *Cannot* create new links.
    *   *Cannot* see analytics.
*   **Admin Users**:
    *   Can create, edit, and delete their own links.
    *   Can view analytics for their links.
    *   Can upload logos and screenshots.

## 👑 How to Make Yourself an Admin

By default, new users are **NOT** admins. To grant yourself admin privileges:

1.  Sign up in the application (e.g., `http://localhost:3000/login`).
2.  Go to the Supabase **SQL Editor**.
3.  Run this command (replace with your email):

```sql
insert into public.user_roles (id, is_admin)
select id, true from auth.users where email = 'your-email@example.com'
on conflict (id) do update set is_admin = true;
```

## ⚠️ Important Note on "Schema Drift"
There are several `.sql` files in the root directory from previous development iterations. **You can safely ignore or delete them.** The `supabase/schema.sql` file supersedes all of them.
