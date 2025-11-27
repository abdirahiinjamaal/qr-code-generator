'use client'

import { LayoutDashboard, Users, Share2, Link as LinkIcon } from 'lucide-react'
import { TabType } from '@/types/dashboard'

interface TabNavigationProps {
    activeTab: TabType
    onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const tabs = [
        { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
        { id: 'audience' as TabType, label: 'Audience', icon: Users },
        { id: 'sources' as TabType, label: 'Sources', icon: Share2 },
        { id: 'links' as TabType, label: 'Links Manager', icon: LinkIcon },
    ]

    return (
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit overflow-x-auto">
            {tabs.map(tab => {
                const Icon = tab.icon
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-[#ff6602] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}
