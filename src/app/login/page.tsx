'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Check for and clear invalid sessions
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                // If there's an auth error (like invalid refresh token), clear the session
                if (error) {
                    console.error('Session error:', error.message)
                    await supabase.auth.signOut()
                }
            } catch (error) {
                console.error('Error checking session:', error)
                await supabase.auth.signOut()
            }
        }

        checkSession()
    }, [])

    // Note: We don't auto-redirect logged-in users here to avoid redirect loops
    // If a non-admin is logged in, they can logout and try a different account

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            toast.success('Logged in successfully!')

            // Check if user is admin and redirect accordingly
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single()

                // Redirect to dashboard if admin, otherwise to home
                if (roleData?.is_admin) {
                    router.push('/dashboard')
                } else {
                    router.push('/')
                }
            } else {
                router.push('/')
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <LinkIcon className="w-8 h-8 text-[#ff6602]" />
                        <h1 className="text-3xl font-bold text-gray-900">Universal QR</h1>
                    </div>
                    <p className="text-gray-600">Admin Login</p>
                    <p className="text-sm text-gray-500 mt-2">Sign in to access the QR code generator</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007fff] focus:border-[#007fff] transition-colors text-gray-900"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ff6602] hover:bg-[#e65a02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007fff] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                            <strong>Admin Access Only:</strong> This application is restricted to authorized administrators.
                            Contact your system administrator for access.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
