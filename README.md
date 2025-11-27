# 📱 Universal QR Code Generator

A modern, full-stack web application for generating smart QR codes that intelligently route users to the appropriate app store (iOS, Android) or website. Built with Next.js 16, TypeScript, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 🎯 Smart QR Codes
- **Universal Links**: One QR code for iOS, Android, and Web platforms
- **Platform Detection**: Automatically redirects users to the right app store
- **Custom Branding**: Add your app logo to QR codes
- **Campaign Tracking**: Track clicks by source (TikTok, Instagram, Facebook, etc.)

### 📊 Advanced Analytics
- **Real-time Dashboard**: Monitor QR code performance
- **Geographic Data**: See where your users are from (country & city)
- **Platform Breakdown**: Track iOS, Android, and Web clicks separately
- **Traffic Sources**: Identify which campaigns drive the most downloads
- **Engagement Metrics**: App ratings and review counts

### 🎨 Modern UI/UX
- **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- **Dark Mode Ready**: Beautiful gradient-based design
- **Smooth Animations**: Premium micro-interactions
- **Toast Notifications**: Non-intrusive user feedback

### 🔒 Security
- **Row Level Security (RLS)**: Database-level access control
- **Admin-only Creation**: Only authorized users can create QR codes
- **Public Landing Pages**: Anyone can scan and click
- **Secure Storage**: Images stored in Supabase Storage with proper policies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdirahiinjamaal/qr-code-generator.git
   cd qr-code-generator/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase/schema.sql`
   - Create storage buckets: `logos` and `screenshots` (both public)

5. **Make yourself an admin**
   After signing up in the app, run this in Supabase SQL Editor:
   ```sql
   insert into public.user_roles (id, is_admin)
   select id, true from auth.users where email = 'your-email@example.com'
   on conflict (id) do update set is_admin = true;
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home (QR Generator)
│   │   ├── dashboard/         # Analytics Dashboard
│   │   ├── create/            # Create New Link
│   │   ├── l/[id]/            # Public Landing Page
│   │   └── login/             # Authentication
│   ├── components/            # Reusable React components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── generator/         # Generator components
│   │   └── landing/           # Landing page components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDashboardData.ts
│   │   ├── useGenerator.ts
│   │   ├── useCreateLink.ts
│   │   └── useLandingPage.ts
│   ├── lib/                   # Utilities & configurations
│   │   ├── supabase.ts        # Supabase client
│   │   └── dashboardUtils.ts  # Analytics helpers
│   └── types/                 # TypeScript type definitions
│       ├── dashboard.ts
│       ├── generator.ts
│       └── landing.ts
├── supabase/
│   ├── schema.sql             # Database schema
│   └── legacy/                # Old migration files
├── public/                    # Static assets
└── package.json
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Charts**: Recharts
- **QR Generation**: qrcode.react
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📊 Database Schema

The application uses 3 main tables:

1. **`links`**: Stores QR code data (title, URLs, logo, screenshots, etc.)
2. **`clicks`**: Analytics data (platform, source, geolocation, timestamp)
3. **`user_roles`**: Admin access control

See `supabase/schema.sql` for the complete schema and security policies.

## 🎨 Key Components

### Generator Page (`/`)
- Create new QR codes
- Upload app logos
- Set platform-specific URLs
- Toggle platform visibility

### Dashboard (`/dashboard`)
- Overview with total clicks and active links
- Audience analytics (countries, platforms)
- Traffic sources breakdown
- Links management table

### Landing Page (`/l/[id]`)
- Beautiful app showcase
- Platform-specific download buttons
- Screenshot gallery
- Click tracking with geolocation

## 🔐 Security Best Practices

1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **Admin-only Writes**: Only admins can create/edit links
3. **Public Reads**: Landing pages are publicly accessible
4. **Secure Functions**: `is_admin()` uses `SECURITY DEFINER`
5. **Input Validation**: URL validation on all platform links

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- Mobile: 0-640px
- Tablet: 640-1024px
- Desktop: 1024px+

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by Caawiye.com**
