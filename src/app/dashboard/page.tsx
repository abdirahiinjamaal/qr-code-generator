'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    Loader2,
    BarChart3,
    ExternalLink,
    Trash2,
    Download,
    Smartphone,
    Globe,
    Copy,
    Check,
    TrendingUp,
    Link as LinkIcon,
    Calendar
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
    created_at: string
    'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    Loader2,
    BarChart3,
    ExternalLink,
    Trash2,
    Download,
    Smartphone,
    Globe,
    Copy,
    Check,
    TrendingUp,
    Link as LinkIcon,
    Calendar
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
    created_at: string
}

interface LinkStats {
    id: string
    title: string
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
                        show_ios,
                        show_android,
                        show_web,
                        clicks (
                            platform,
                            source,
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
                        </div >
                        <div className="text-3xl font-bold text-gray-900">{totalLinks}</div>
                        <div className="text-sm text-gray-500">Active Links</div>
                    </div >

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
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {links.length > 0 ? new Date(links[0].created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">Last Created</div>
                    </div>
                </div >

        {/* Charts Section */ }
        < div className = "grid grid-cols-1 lg:grid-cols-3 gap-8" >
            {/* Area Chart */ }
            < div className = "lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100" >
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Clicks Overview (Last 7 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={clicksOverTime}>
                                    <defs>
                                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff6602" stopOpacity={0.1} />
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
                    </div >

        {/* Pie Chart */ }
        < div className = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100" >
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Distribution</h3>
                        <div className="h-[300px] w-full relative">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
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
                                    No data available
                                </div>
                            )}
                        </div>
                    </div >
                </div >

        {/* Links Table */ }
        < div className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" >
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Your Links</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">App Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Platforms</th>
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
                                                <div className="flex gap-2">
                                                    <div className={`p-1.5 rounded-md ${link.show_ios ? 'bg-black text-white' : 'bg-gray-100 text-gray-300'}`} title="iOS">
                                                        <Smartphone className="w-4 h-4" />
                                                    </div>
                                                    <div className={`p-1.5 rounded-md ${link.show_android ? 'bg-[#3DDC84] text-white' : 'bg-gray-100 text-gray-300'}`} title="Android">
                                                        <Smartphone className="w-4 h-4" />
                                                    </div>
                                                    <div className={`p-1.5 rounded-md ${link.show_web ? 'bg-[#007fff] text-white' : 'bg-gray-100 text-gray-300'}`} title="Web">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                </div>
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
                </div >
            </div >
        </main >
    )
}
