'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, Smartphone, Globe, AlertCircle, ShoppingCart, Package, Truck, Store } from 'lucide-react'

interface LinkData {
    id: string
    title: string
    ios_url: string
    android_url: string
    web_url: string
}

export default function RedirectPage() {
    const params = useParams()
    const [linkData, setLinkData] = useState<LinkData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLink = async () => {
            if (!params.id) return

            try {
                const { data, error } = await supabase
                    .from('links')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (error) throw error
                setLinkData(data)
            } catch (err) {
                console.error('Error fetching link:', err)
                setError('Link not found or invalid')
            } finally {
                setLoading(false)
            }
        }

        fetchLink()
    }, [params.id])

    const handleClick = async (platform: 'ios' | 'android' | 'web', url: string) => {
        if (!url) return

        // Log click asynchronously (fire and forget)
        supabase
            .from('clicks')
            .insert({
                link_id: params.id,
                platform,
                user_agent: navigator.userAgent
            })
            .then(({ error }) => {
                if (error) console.error('Error logging click:', error)
            })

        // Redirect
        window.location.href = url
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6602]" />
            </div>
        )
    }

    if (error || !linkData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error || 'Something went wrong'}</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Animated Gradient Background - Orange Dominant */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6602] via-[#ff6602] to-[#ff8c3a] animate-gradient-xy"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6602] via-[#ff8c3a] to-[#007fff] opacity-40 animate-gradient-slow"></div>

            {/* Floating E-commerce Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ShoppingCart className="absolute text-white/10 animate-float-1" style={{ width: '80px', height: '80px', top: '10%', left: '10%' }} />
                <Package className="absolute text-white/10 animate-float-2" style={{ width: '60px', height: '60px', top: '20%', right: '15%' }} />
                <Truck className="absolute text-white/10 animate-float-3" style={{ width: '100px', height: '100px', bottom: '15%', left: '5%' }} />
                <Store className="absolute text-white/10 animate-float-4" style={{ width: '70px', height: '70px', top: '60%', right: '10%' }} />
                <ShoppingCart className="absolute text-white/10 animate-float-5" style={{ width: '50px', height: '50px', bottom: '30%', right: '25%' }} />
                <Package className="absolute text-white/10 animate-float-6" style={{ width: '90px', height: '90px', top: '40%', left: '20%' }} />
            </div>

            {/* Content */}
            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{linkData.title}</h1>
                    <p className="text-white/90 drop-shadow">Choose your platform to continue</p>
                </div>

                <div className="space-y-4">
                    {linkData.ios_url && (
                        <button
                            onClick={() => handleClick('ios', linkData.ios_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black/80 backdrop-blur-sm text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-2xl border border-white/10"
                        >
                            <Smartphone className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs opacity-80">Download on the</div>
                                <div className="text-lg font-bold leading-none">App Store</div>
                            </div>
                        </button>
                    )}

                    {linkData.android_url && (
                        <button
                            onClick={() => handleClick('android', linkData.android_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#3DDC84]/90 backdrop-blur-sm text-white rounded-xl hover:bg-[#32b36b] transition-all active:scale-95 shadow-2xl border border-white/10"
                        >
                            <Smartphone className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs opacity-90">GET IT ON</div>
                                <div className="text-lg font-bold leading-none">Google Play</div>
                            </div>
                        </button>
                    )}

                    {linkData.web_url && (
                        <button
                            onClick={() => handleClick('web', linkData.web_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm text-[#007fff] rounded-xl hover:bg-white transition-all active:scale-95 shadow-2xl border border-white/20"
                        >
                            <Globe className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs opacity-80">Visit Website</div>
                                <div className="text-lg font-bold leading-none">Open in Browser</div>
                            </div>
                        </button>
                    )}
                </div>

                <div className="text-center text-sm text-white/60 mt-8 drop-shadow">
                    Powered by Universal QR
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes gradient-xy {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-slow {
                    0%, 100% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                }
                @keyframes float-1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -50px) rotate(120deg); }
                    66% { transform: translate(-20px, 30px) rotate(240deg); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-40px, 60px) rotate(180deg); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(50px, -30px) rotate(-120deg); }
                    66% { transform: translate(-30px, -50px) rotate(-240deg); }
                }
                @keyframes float-4 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(20px, -40px) rotate(180deg); }
                }
                @keyframes float-5 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-30px, 20px) rotate(90deg); }
                    75% { transform: translate(30px, -20px) rotate(270deg); }
                }
                @keyframes float-6 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-25px, -40px) rotate(120deg); }
                    66% { transform: translate(25px, 40px) rotate(240deg); }
                }
                .animate-gradient-xy {
                    background-size: 400% 400%;
                    animation: gradient-xy 15s ease infinite;
                }
                .animate-gradient-slow {
                    background-size: 200% 200%;
                    animation: gradient-slow 10s ease infinite;
                }
                .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 15s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 25s ease-in-out infinite; }
                .animate-float-4 { animation: float-4 18s ease-in-out infinite; }
                .animate-float-5 { animation: float-5 22s ease-in-out infinite; }
                .animate-float-6 { animation: float-6 20s ease-in-out infinite; }
            `}</style>
        </main>
    )
}
