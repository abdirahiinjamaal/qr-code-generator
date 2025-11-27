'use client'

import { useRouter } from 'next/navigation'
import { Download, LinkIcon, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { LinkStats } from '@/types/dashboard'

interface DashboardHeaderProps {
    links: LinkStats[]
}

export function DashboardHeader({ links }: DashboardHeaderProps) {
    const router = useRouter()

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
        toast.success('CSV exported successfully')
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/login')
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-1">Monitor your QR code performance</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                    onClick={handleExport}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
                <a
                    href="/create"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6602] text-white rounded-xl hover:bg-[#e65a02] transition-colors shadow-sm whitespace-nowrap"
                >
                    <LinkIcon className="w-4 h-4" />
                    Create New
                </a>
                <button
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}
