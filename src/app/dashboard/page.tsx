'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { TabNavigation } from '@/components/dashboard/TabNavigation'
import { OverviewTab } from '@/components/dashboard/OverviewTab'
import { AudienceTab } from '@/components/dashboard/AudienceTab'
import { SourcesTab } from '@/components/dashboard/SourcesTab'
import { LinksManagerTab } from '@/components/dashboard/LinksManagerTab'
import { EditLinkModal } from '@/components/dashboard/EditLinkModal'
import {
    calculateTotalClicks,
    calculatePlatformStats,
    calculateSourceStats,
    calculateLocationStats,
    calculateClicksOverTime
} from '@/lib/dashboardUtils'
import { LinkStats, TabType } from '@/types/dashboard'

export default function Dashboard() {
    const { links, setLinks, loading } = useDashboardData()
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [editingLink, setEditingLink] = useState<LinkStats | null>(null)

    // Calculate all stats
    const totalClicks = calculateTotalClicks(links)
    const totalLinks = links.length
    const platformData = calculatePlatformStats(links)
    const sourceData = calculateSourceStats(links)
    const locationData = calculateLocationStats(links)
    const clicksOverTime = calculateClicksOverTime(links)

    const topPlatform = platformData.length > 0
        ? platformData.sort((a, b) => b.value - a.value)[0].name
        : 'N/A'
    const topCountry = locationData.length > 0 ? locationData[0].name : 'N/A'

    const handleUpdateLink = (updatedLink: LinkStats) => {
        setLinks(links.map(l => l.id === updatedLink.id ? updatedLink : l))
    }

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
                <DashboardHeader links={links} />

                {/* Tabs */}
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <OverviewTab
                        totalClicks={totalClicks}
                        totalLinks={totalLinks}
                        topPlatform={topPlatform}
                        topCountry={topCountry}
                        clicksOverTime={clicksOverTime}
                    />
                )}

                {activeTab === 'audience' && (
                    <AudienceTab
                        locationData={locationData}
                        platformData={platformData}
                    />
                )}

                {activeTab === 'sources' && (
                    <SourcesTab sourceData={sourceData} />
                )}

                {activeTab === 'links' && (
                    <LinksManagerTab
                        links={links}
                        onLinksChange={setLinks}
                        onEditLink={setEditingLink}
                    />
                )}

                {/* Edit Modal */}
                {editingLink && (
                    <EditLinkModal
                        link={editingLink}
                        onClose={() => setEditingLink(null)}
                        onUpdate={handleUpdateLink}
                    />
                )}
            </div>
        </main>
    )
}
