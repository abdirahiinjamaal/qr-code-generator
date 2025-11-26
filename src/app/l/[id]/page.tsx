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
    logo_url: string
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
                'use client'

                import {useEffect, useState} from 'react'
                import {useParams} from 'next/navigation'
                import {supabase} from '@/lib/supabase'
                import {Loader2, Smartphone, Globe, AlertCircle, ShoppingCart, Package, Truck, Store} from 'lucide-react'

                interface LinkData {
                    id: string
                title: string
                ios_url: string
                android_url: string
                web_url: string
                logo_url: string
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
                const {data, error} = await supabase
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
                .then(({error}) => {
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

                    <div className="text-center text-sm text-gray-400 mt-8">
                        Powered by Universal QR
                    </div>
                </div>
                )
    }

                return (
                <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                        {linkData.logo_url && (
                            <img
                                src={linkData.logo_url}
                                alt={`${linkData.title} logo`}
                                className="w-24 h-24 mx-auto mb-4 object-contain"
                            />
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{linkData.title}</h1>
                        <p className="text-gray-600 mb-6">Choose how you'd like to open this link:</p>

                        <div className="space-y-4">
                            {linkData.ios_url && (
                                <button
                                    onClick={() => handleClick('ios', linkData.ios_url)}
                                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff6602] hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6602]"
                                >
                                    <Smartphone className="mr-2 h-5 w-5" /> Open in iOS App
                                </button>
                            )}
                            {linkData.android_url && (
                                <button
                                    onClick={() => handleClick('android', linkData.android_url)}
                                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3DDC84] hover:bg-[#34c274] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3DDC84]"
                                >
                                    <Smartphone className="mr-2 h-5 w-5" /> Open in Android App
                                </button>
                            )}
                            {linkData.web_url && (
                                <button
                                    onClick={() => handleClick('web', linkData.web_url)}
                                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Globe className="mr-2 h-5 w-5" /> Open in Web Browser
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-400 mt-8">
                        Powered by Universal QR
                    </div>
                </main>
                )
}
