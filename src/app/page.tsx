'use client'

import Link from 'next/link'
import { QrCode, TrendingUp, Globe, Smartphone, BarChart3, Shield } from 'lucide-react'

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-[#ff6602] to-[#e65a02] rounded-2xl shadow-2xl">
                            <QrCode className="w-16 h-16 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Universal QR Code Generator
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Create smart QR codes that intelligently route users to the right app store.
                        Track analytics and optimize your downloads.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-[#ff6602] text-white text-lg font-semibold rounded-xl hover:bg-[#e65a02] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Admin Login
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg border border-gray-200"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    Powerful Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-[#ff6602]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Universal Links</h3>
                        <p className="text-gray-600">
                            One QR code works for iOS, Android, and Web. Automatically routes users to the correct platform.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                        <p className="text-gray-600">
                            Track clicks by platform, location, and campaign source. See which channels drive the most downloads.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <Smartphone className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Detection</h3>
                        <p className="text-gray-600">
                            Automatically detects user's device and shows the right download button (App Store or Play Store).
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Campaign Tracking</h3>
                        <p className="text-gray-600">
                            Generate unique QR codes for each campaign (TikTok, Instagram, billboards) and track performance.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                        <p className="text-gray-600">
                            Enterprise-grade security with row-level security policies. Admin-only access control.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                            <QrCode className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding</h3>
                        <p className="text-gray-600">
                            Add your app logo to QR codes and customize the landing page with screenshots and ratings.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-[#ff6602] to-[#e65a02] rounded-3xl shadow-2xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Login to your admin account and start creating smart QR codes today.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-8 py-4 bg-white text-[#ff6602] text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-xl"
                    >
                        Access Admin Panel
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                    <p>© 2025 Universal QR Code Generator. Built with ❤️ by Caawiye.com</p>
                </div>
            </footer>
        </main>
    )
}
