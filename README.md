# Universal QR Code Generator

A modern web application for generating QR codes that direct users to a landing page with App Store, Play Store, and website links. Built with Next.js and Supabase.

## Features

- 🎯 **Single QR Code**: One QR code for iOS App Store, Google Play Store, and Website
- 📊 **Analytics Dashboard**: Track clicks by platform (iOS, Android, Web)
- 🔐 **Authentication**: Secure login/signup with Supabase Auth
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📈 **Real-time Charts**: Visualize click data with Recharts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Charts**: Recharts
- **QR Generation**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL from `supabase_schema.sql` in your Supabase SQL Editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Enable Email Authentication**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Email provider

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses two main tables:

- **links**: Stores QR code destinations (iOS, Android, Web URLs)
- **clicks**: Tracks analytics data for each click

Row Level Security (RLS) is enabled to ensure users can only access their own data.

## Usage

1. **Sign up** for an account
2. **Create a link** by entering your App Store, Play Store, and Website URLs
3. **Generate QR code** and download or share it
4. **Track analytics** in the dashboard to see which platform gets the most clicks

## License

MIT

## Author

Built with ❤️ using Next.js and Supabase
