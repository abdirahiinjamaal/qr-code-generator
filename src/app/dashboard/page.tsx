
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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

    const handleExport = () => {
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

    // Calculate aggregate stats
    const totalClicks = links.reduce((sum, link) => sum + link.clicks.length, 0)
    const totalLinks = links.length

    const platformStats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            acc[click.platform] = (acc[click.platform] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    const pieData = [
        { name: 'iOS', value: platformStats['ios'] || 0, color: '#000000' },
        { name: 'Android', value: platformStats['android'] || 0, color: '#3DDC84' },
        { name: 'Web', value: platformStats['web'] || 0, color: '#007fff' },
    ].filter(d => d.value > 0)

    // Calculate source stats
    const sourceStats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const source = click.source || 'direct'
            acc[source] = (acc[source] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    const barData = Object.entries(sourceStats)
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
        .sort((a, b) => b.value - a.value)

    // Calculate clicks over time (last 7 days)
    const clicksOverTime = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse().map(date => {
        const count = links.reduce((sum, link) => {
            return sum + link.clicks.filter(c => c.created_at.startsWith(date)).length
        }, 0)
        return { date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), count }
    })

    // Calculate location stats
    const locationStats = links.reduce((acc, link) => {
        link.clicks.forEach(click => {
            const country = click.country || 'Unknown'
            acc[country] = (acc[country] || 0) + 1
        })
        return acc
    }, {} as Record<string, number>)

    const locationData = Object.entries(locationStats)
        .map(([name, value]) => ({
            name,
            value,
            color: '#8884d8'
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6602]" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-500 mt-1">Monitor your QR code performance</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <a
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-[#ff6602] text-white rounded-xl hover:bg-[#e65a02] transition-colors shadow-sm"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Create New
                        </a>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'overview'
                                ? 'bg-[#ff6602] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('audience')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'audience'
                                ? 'bg-[#ff6602] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Audience
                    </button>
                    <button
                        onClick={() => setActiveTab('sources')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'sources'
                                ? 'bg-[#ff6602] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Share2 className="w-4 h-4" />
                        Sources
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'links'
                                ? 'bg-[#ff6602] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <LinkIcon className="w-4 h-4" />
                        Links Manager
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-[#ff6602]" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{totalClicks}</div>
                                <div className="text-sm text-gray-500">Total Clicks</div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <LinkIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{totalLinks}</div>
                                <div className="text-sm text-gray-500">Active Links</div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Smartphone className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">Top Platform</div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Globe className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {locationData.length > 0 ? locationData[0].name : 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">Top Country</div>
                            </div>
                        </div>

                        {/* Area Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Clicks Over Time (Last 7 Days)</h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={clicksOverTime}>
                                        <defs>
                                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff6602" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ff6602" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#ff6602" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audience' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Countries */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">🌍 Top Countries</h3>
                            <div className="h-[350px] w-full">
                                {locationData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={locationData} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={80} />
                                            <Tooltip
                                                cursor={{ fill: '#f9fafb' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400">
                                        No location data yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Platform Distribution */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">📱 Platform Distribution</h3>
                            <div className="h-[350px] w-full relative">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        No platform data yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sources' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">🚦 Traffic Sources</h3>
                        <div className="h-[450px] w-full">
                            {barData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                                        <Tooltip
                                            cursor={{ fill: '#f9fafb' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No traffic source data yet
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">🔗 Your Links</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">App Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Split</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {links.map((link) => {
                                        const ios = link.clicks.filter(c => c.platform === 'ios').length
                                        const android = link.clicks.filter(c => c.platform === 'android').length
                                        const web = link.clicks.filter(c => c.platform === 'web').length
                                        const total = link.clicks.length

                                        return (
                                            <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{link.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {window.location.origin}/l/{link.id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(link.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{total}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex h-2 w-24 rounded-full overflow-hidden bg-gray-100">
                                                        {total > 0 && (
                                                            <>
                                                                <div style={{ width: `${(ios / total) * 100}%` }} className="bg-black" title="iOS" />
                                                                <div style={{ width: `${(android / total) * 100}%` }} className="bg-[#3DDC84]" title="Android" />
                                                                <div style={{ width: `${(web / total) * 100}%` }} className="bg-[#007fff]" title="Web" />
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 mt-1 text-[10px] text-gray-400">
                                                        {ios > 0 && <span>iOS: {ios}</span>}
                                                        {android > 0 && <span>And: {android}</span>}
                                                        {web > 0 && <span>Web: {web}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleCopy(link.id)}
                                                            className="p-2 text-gray-400 hover:text-[#007fff] hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Copy Link"
                                                        >
                                                            {copiedId === link.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                        <a
                                                            href={`/l/${link.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-gray-400 hover:text-[#ff6602] hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Visit Link"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => setEditingLink(link)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Link"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(link.id, link.title)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Link"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingLink && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
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
