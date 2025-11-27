'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, Smartphone, Globe, AlertCircle, Star } from 'lucide-react'

interface LinkData {
    id: string
    title: string
    description: string
    ios_url: string
    android_url: string
    web_url: string
    logo_url: string
    show_ios: boolean
    show_android: boolean
    show_web: boolean
    screenshots: string[]
    rating: number
    review_count: number
}

export default function RedirectPage() {
    const params = useParams()
    const searchParams = useSearchParams()
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

        // Get source from URL (e.g. ?s=tiktok) or default to 'direct'
        const source = searchParams.get('s') || 'direct'

        // 1. Fetch Geolocation (Best effort)
        let country = 'Unknown'
        let city = 'Unknown'
        try {
            const res = await fetch('https://ipapi.co/json/')
            if (res.ok) {
                const data = await res.json()
                country = data.country_name || 'Unknown'
                city = data.city || 'Unknown'
            }
        } catch (e) {
            console.error('Failed to fetch location', e)
        }

        // 2. Log click asynchronously
        supabase
            .from('clicks')
            .insert({
                link_id: params.id,
                platform,
                source,
                country,
                city,
                user_agent: navigator.userAgent
            })
            .then(({ error }) => {
                if (error) console.error('Error logging click:', error)
            })

        // 3. Redirect
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
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* App Screenshots (Top Banner) */}
                {linkData.screenshots && linkData.screenshots.length > 0 && (
                    <div className="mb-6">
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar justify-center">
                            {linkData.screenshots.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-24 h-auto rounded-lg shadow-sm border border-gray-100 flex-shrink-0 snap-center"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    {linkData.logo_url && (
                        <div className="mb-6 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={linkData.logo_url}
                                alt={linkData.title}
                                className="w-24 h-24 rounded-2xl shadow-2xl border-4 border-gray-200 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{linkData.title}</h1>
                    <p className="text-gray-600 mb-4">{linkData.description || 'Kala soo Deg Appka Caawiye Playstoreka ama App Storeka'}</p>

                    {/* Social Proof */}
                    {(linkData.rating > 0 || linkData.review_count > 0) && (
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex items-center text-yellow-400">
                                <span className="text-gray-900 font-bold text-lg mr-1">{linkData.rating || '4.9'}</span>
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-500 text-sm">{linkData.review_count ? `${linkData.review_count}+ Reviews` : '1k+ Reviews'}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {linkData.show_ios && linkData.ios_url && (
                        <button
                            onClick={() => handleClick('ios', linkData.ios_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/apple-logo-svgrepo-com.svg" alt="Apple" className="w-6 h-6 brightness-0 invert" />
                            <div className="text-left">
                                <div className="text-xs opacity-80">Download on the</div>
                                <div className="text-lg font-bold leading-none">App Store</div>
                            </div>
                        </button>
                    )}

                    {linkData.show_android && linkData.android_url && (
                        <button
                            onClick={() => handleClick('android', linkData.android_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#3DDC84] text-white rounded-xl hover:bg-[#32b36b] transition-all active:scale-95 shadow-lg"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs opacity-90">GET IT ON</div>
                                <div className="text-lg font-bold leading-none">Google Play</div>
                            </div>
                        </button>
                    )}

                    {linkData.show_web && linkData.web_url && (
                        <button
                            onClick={() => handleClick('web', linkData.web_url)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#007fff] text-white rounded-xl hover:bg-[#006ee6] transition-all active:scale-95 shadow-lg"
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
                    Powered by Caawiye.com
                </div>
            </div>
        </main>
    )
}
