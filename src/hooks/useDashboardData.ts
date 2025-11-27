'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LinkStats } from '@/types/dashboard'

export function useDashboardData() {
    const [links, setLinks] = useState<LinkStats[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    router.push('/login')
                    return
                }

                const { data, error } = await supabase
                    .from('links')
                    .select(`
                        id,
                        title,
                        description,
                        ios_url,
                        android_url,
                        web_url,
                        created_at,
                        show_ios,
                        show_android,
                        show_web,
                        screenshots,
                        rating,
                        review_count,
                        clicks (
                            platform,
                            source,
                            country,
                            city,
                            created_at
                        )
                    `)
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setLinks(data || [])
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [router])

    return { links, setLinks, loading }
}
