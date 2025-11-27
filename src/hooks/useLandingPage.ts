'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LinkData } from '@/types/landing'

export function useLandingPage() {
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

    const handlePlatformClick = async (platform: 'ios' | 'android' | 'web', url: string) => {
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

    return {
        linkData,
        loading,
        error,
        handlePlatformClick
    }
}
