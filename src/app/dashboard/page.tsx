
'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import {
    Loader2,
    ExternalLink,
    Trash2,
    Download,
    Smartphone,
    Globe,
    Copy,
    Check,
    TrendingUp,
    LayoutDashboard,
    Users,
    Share2,
    Link as LinkIcon,
    Pencil,
    X
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    CartesianGrid,
    PieChart,
    Pie,
    Legend
} from 'recharts'

interface ClickData {
    platform: string
    source: string
    country?: string
    city?: string
    created_at: string
}

interface LinkStats {
    id: string
    title: string
    description: string
    ios_url: string
    android_url: string
    web_url: string
    created_at: string
    show_ios: boolean
    show_android: boolean
    show_web: boolean
    clicks: ClickData[]
}

export default function Dashboard() {
    const [links, setLinks] = useState<LinkStats[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [editingLink, setEditingLink] = useState<LinkStats | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'sources' | 'links'>('overview')
    const router = useRouter()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    router.push('/login')
                    return
                }

                // Optimized: Fetch only clicks from last 30 days for better performance
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                const cutoffDate = thirtyDaysAgo.toISOString()

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
                        clicks!inner (
                            platform,
                            source,
                            country,
                            city,
                            created_at
                        )
                    `)
                    .eq('user_id', session.user.id)
                    .gte('clicks.created_at', cutoffDate)
                    .order('created_at', { ascending: false })
                    .limit(50) // Limit to 50 most recent links

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

            setLinks(links.filter(link => link.id !== linkId))
        } catch (error) {
            console.error('Error deleting link:', error)
            alert('❌ Failed to delete link')
        }
    }

    const handleCopy = (id: string) => {
        const url = `${window.location.origin}/l/${id}`
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleUpdateLink = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingLink) return

        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from('links')
                .update({
                    title: editingLink.title,
                    description: editingLink.description,
                    ios_url: editingLink.ios_url,
                    android_url: editingLink.android_url,
                    web_url: editingLink.web_url,
                    show_ios: editingLink.show_ios,
                    show_android: editingLink.show_android,
                    show_web: editingLink.show_web,
                })
                .eq('id', editingLink.id)

            if (error) throw error

            // Update local state
            setLinks(links.map(l => l.id === editingLink.id ? editingLink : l))
            setEditingLink(null)
            alert('✅ Link updated successfully!')
        } catch (error) {
            console.error('Error updating link:', error)
            alert('❌ Failed to update link')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleExportExcel = () => {
        // Create workbook
        const wb = XLSX.utils.book_new()

        // 1. Summary Sheet
        const summaryData = [
            ['QR Code Analytics Report'],
            ['Generated:', new Date().toLocaleString()],
            [''],
            ['Overview'],
            ['Total Links', totalLinks],
            ['Total Clicks', totalClicks],
            ['Average Clicks per Link', totalLinks > 0 ? (totalClicks / totalLinks).toFixed(2) : 0],
            [''],
            ['Platform Distribution'],
            ['iOS Clicks', platformStats['ios'] || 0],
            ['Android Clicks', platformStats['android'] || 0],
            ['Web Clicks', platformStats['web'] || 0],
            [''],
            ['Top Sources'],
            ...barData.slice(0, 5).map(s => [s.name, s.value]),
            [''],
            ['Top Countries'],
            ...locationData.slice(0, 5).map(l => [l.name, l.value])
        ]
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
        summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

        // 2. Links Sheet
        const linksData = [
            ['Link ID', 'Title', 'Description', 'Created Date', 'Total Clicks', 'iOS Clicks', 'Android Clicks', 'Web Clicks', 'Link URL'],
            ...links.map(link => {
                const ios = link.clicks.filter(c => c.platform === 'ios').length
                const android = link.clicks.filter(c => c.platform === 'android').length
                const web = link.clicks.filter(c => c.platform === 'web').length
                return [
                    link.id,
                    link.title,
                    link.description || '',
                    new Date(link.created_at).toLocaleDateString(),
                    link.clicks.length,
                    ios,
                    android,
                    web,
                    `${window.location.origin}/l/${link.id}`
                ]
            })
        ]
        const linksSheet = XLSX.utils.aoa_to_sheet(linksData)
        linksSheet['!cols'] = [
            { wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 12 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 40 }
        ]
        XLSX.utils.book_append_sheet(wb, linksSheet, 'Links')

        // 3. Detailed Clicks Sheet
        const clicksData = [
            ['Link Title', 'Click Date', 'Platform', 'Source', 'Country', 'City'],
            ...links.flatMap(link =>
                link.clicks.map(click => [
                    link.title,
                    new Date(click.created_at).toLocaleString(),
                    click.platform,
                    click.source || 'direct',
                    click.country || 'Unknown',
                    click.city || 'Unknown'
                ])
            )
        ]
        const clicksSheet = XLSX.utils.aoa_to_sheet(clicksData)
        clicksSheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
        XLSX.utils.book_append_sheet(wb, clicksSheet, 'All Clicks')

        // 4. Daily Analytics Sheet
        const dailyData = [
            ['Date', 'Clicks'],
            ...clicksOverTime.map(day => [day.date, day.count])
        ]
        const dailySheet = XLSX.utils.aoa_to_sheet(dailyData)
        dailySheet['!cols'] = [{ wch: 15 }, { wch: 10 }]
        XLSX.utils.book_append_sheet(wb, dailySheet, 'Daily Clicks')

        // 5. Source Analytics Sheet
        const sourceData = [
            ['Source', 'Clicks', 'Percentage'],
            ...barData.map(s => [
                s.name,
                s.value,
                `${((s.value / totalClicks) * 100).toFixed(1)}%`
            ])
        ]
        const sourceSheet = XLSX.utils.aoa_to_sheet(sourceData)
        sourceSheet['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 12 }]
        XLSX.utils.book_append_sheet(wb, sourceSheet, 'Sources')

        // 6. Location Analytics Sheet
        const locationAnalyticsData = [
            ['Country', 'Clicks', 'Percentage'],
            ...locationData.map(l => [
                l.name,
                l.value,
                `${((l.value / totalClicks) * 100).toFixed(1)}%`
            ])
        ]
        const locationSheet = XLSX.utils.aoa_to_sheet(locationAnalyticsData)
        locationSheet['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 12 }]
        XLSX.utils.book_append_sheet(wb, locationSheet, 'Locations')

        // Export
        XLSX.writeFile(wb, `QR_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const handleExportCSV = () => {
        const csvContent = [
            ['Link Title', 'Created At', 'Total Clicks', 'iOS Clicks', 'Android Clicks', 'Web Clicks', 'Link URL'],
            ...links.map(link => {
                const ios = link.clicks.filter(c => c.platform === 'ios').length
                const android = link.clicks.filter(c => c.platform === 'android').length
                const web = link.clicks.filter(c => c.platform === 'web').length
                return [
                    `"${link.title}"`,
                    new Date(link.created_at).toLocaleDateString(),
                    link.clicks.length,
                    ios,
                    android,
                    web,
                    `${window.location.origin}/l/${link.id}`
                ]
            })
        ].map(e => e.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `qr_stats_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    // Calculate aggregate stats with memoization for performance
    const totalClicks = useMemo(() => links.reduce((sum, link) => sum + link.clicks.length, 0), [links])
    const totalLinks = links.length

    const platformStats = useMemo(() => links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            acc[click.platform] = (acc[click.platform] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>), [links])

    const pieData = useMemo(() => [
        { name: 'iOS', value: platformStats['ios'] || 0, color: '#000000' },
        { name: 'Android', value: platformStats['android'] || 0, color: '#3DDC84' },
        { name: 'Web', value: platformStats['web'] || 0, color: '#007fff' },
    ].filter(d => d.value > 0), [platformStats])

    // Calculate source stats
    const sourceStats = useMemo(() => links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const source = click.source || 'direct'
            acc[source] = (acc[source] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>), [links])

    const barData = useMemo(() => Object.entries(sourceStats)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: name === 'tiktok' ? '#000000' :
                name === 'facebook' ? '#1877F2' :
                    name === 'instagram' ? '#E4405F' :
                        name === 'youtube' ? '#FF0000' :
                            name === 'whatsapp' ? '#25D366' :
                                name === 'telegram' ? '#0088cc' : '#888888'
        }))
        .sort((a, b) => b.value - a.value), [sourceStats])

    // Calculate clicks over time (last 7 days)
    const clicksOverTime = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse().map(date => {
        const count = links.reduce((sum, link) => {
            return sum + link.clicks.filter(c => c.created_at.startsWith(date)).length
        }, 0)
        return { date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), count }
    }), [links])

    // Calculate location stats
    const locationStats = useMemo(() => links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const country = click.country || 'Unknown'
            acc[country] = (acc[country] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>), [links])

    const locationData = useMemo(() => Object.entries(locationStats)
        .map(([name, value]) => ({
            name,
            value,
            color: '#8884d8'
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5), [locationStats])

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Skeleton */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
                        <div className="h-[350px] bg-gray-100 rounded animate-pulse"></div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">Monitor your QR code performance</p>
                    </div>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-900">Edit Link</h2>
                        <button
                            onClick={() => setEditingLink(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <form onSubmit={handleUpdateLink} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                            <input
                                type="text"
                                required
                                value={editingLink.title}
                                onChange={e => setEditingLink({ ...editingLink, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6602] focus:border-[#ff6602] text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={editingLink.description || ''}
                                onChange={e => setEditingLink({ ...editingLink, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6602] focus:border-[#ff6602] text-gray-900"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">Platform URLs</h3>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="pt-2">
                                    <input
                                        type="checkbox"
                                        checked={editingLink.show_ios}
                                        onChange={e => setEditingLink({ ...editingLink, show_ios: e.target.checked })}
                                        className="w-4 h-4 text-[#ff6602] rounded focus:ring-[#ff6602]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">iOS App Store URL</label>
                                    <input
                                        type="url"
                                        value={editingLink.ios_url || ''}
                                        onChange={e => setEditingLink({ ...editingLink, ios_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6602] text-gray-900"
                                        placeholder="https://apps.apple.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="pt-2">
                                    <input
                                        type="checkbox"
                                        checked={editingLink.show_android}
                                        onChange={e => setEditingLink({ ...editingLink, show_android: e.target.checked })}
                                        className="w-4 h-4 text-[#ff6602] rounded focus:ring-[#ff6602]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Android Play Store URL</label>
                                    <input
                                        type="url"
                                        value={editingLink.android_url || ''}
                                        onChange={e => setEditingLink({ ...editingLink, android_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6602] text-gray-900"
                                        placeholder="https://play.google.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="pt-2">
                                    <input
                                        type="checkbox"
                                        checked={editingLink.show_web}
                                        onChange={e => setEditingLink({ ...editingLink, show_web: e.target.checked })}
                                        className="w-4 h-4 text-[#ff6602] rounded focus:ring-[#ff6602]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <input
                                        type="url"
                                        value={editingLink.web_url || ''}
                                        onChange={e => setEditingLink({ ...editingLink, web_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6602] text-gray-900"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setEditingLink(null)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#ff6602] text-white rounded-lg hover:bg-[#e65a02] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            )}
        </main>
    )
}
