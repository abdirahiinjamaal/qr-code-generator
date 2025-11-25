'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, Smartphone, Globe, AlertCircle } from 'lucide-react'

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
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{linkData.title}</h1>
                    <p className="text-gray-600">Choose your platform to continue</p>
                </div>

                <div className="space-y-4">
                    {linkData.ios_url && (
                        <button
                            onClick={() => handleClick('ios', linkData.ios_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-transform active:scale-95 shadow-lg"
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
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#3DDC84] text-white rounded-xl hover:bg-[#32b36b] transition-transform active:scale-95 shadow-lg"
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
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform active:scale-95 shadow-lg"
                        >
                            <Globe className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs opacity-80">Visit Website</div>
                                <div className="text-lg font-bold leading-none">Open in Browser</div>
                            </div>
                        </button>
                    )}
                </div>

                <div className="text-center text-sm text-gray-400 mt-8">
                    Powered by Universal QR
                </div>
            </div>
        </main>
    )
}
