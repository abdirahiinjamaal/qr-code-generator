'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, BarChart3, ExternalLink, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface LinkStats {
    id: string
    title: string
    created_at: string
    clicks: {
        platform: string
    }[]
}

export default function Dashboard() {
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
            created_at,
            clicks (
              platform
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

    const handleDelete = async (linkId: string, linkTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${linkTitle}"? This will also delete all associated click data.`)) {
            return
        }

        try {
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', linkId)

            if (error) throw error

            // Remove from local state
            setLinks(links.filter(link => link.id !== linkId))
            alert('✅ Link deleted successfully')
        } catch (error) {
            console.error('Error deleting link:', error)
            alert('❌ Failed to delete link')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <a
                        href="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create New Link
                    </a>
                </div>

                {links.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No links yet</h3>
                        <p className="text-gray-500 mt-2">Create your first universal link to see stats.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {links.map((link) => {
                            const iosClicks = link.clicks.filter(c => c.platform === 'ios').length
                            const androidClicks = link.clicks.filter(c => c.platform === 'android').length
                            const webClicks = link.clicks.filter(c => c.platform === 'web').length
                            const totalClicks = link.clicks.length

                            const chartData = [
                                { name: 'iOS', value: iosClicks, color: '#000000' },
                                { name: 'Android', value: androidClicks, color: '#3DDC84' },
                                { name: 'Web', value: webClicks, color: '#2563EB' },
                            ]

                            return (
                                <div key={link.id} className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 truncate max-w-[200px]">{link.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(link.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a
                                                href={`/l/${link.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Open link"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(link.id, link.title)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete link"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="text-3xl font-bold text-gray-900">{totalClicks}</div>
                                        <div className="text-sm text-gray-500">Total Clicks</div>
                                    </div>

                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis hide />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
