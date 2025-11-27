'use client'

import { TrendingUp, Link as LinkIcon, Smartphone, Globe } from 'lucide-react'

interface StatsCardsProps {
    totalClicks: number
    totalLinks: number
    topPlatform: string
    topCountry: string
}

export function StatsCards({ totalClicks, totalLinks, topPlatform, topCountry }: StatsCardsProps) {
    const stats = [
        {
            title: 'Total Clicks',
            value: totalClicks,
            icon: TrendingUp,
            bgColor: 'bg-orange-50',
            iconColor: 'text-[#ff6602]'
        },
        {
            title: 'Active Links',
            value: totalLinks,
            icon: LinkIcon,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Top Platform',
            value: topPlatform,
            icon: Smartphone,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Top Country',
            value: topCountry,
            icon: Globe,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.title}</div>
                    </div>
                )
            })}
        </div>
    )
}
