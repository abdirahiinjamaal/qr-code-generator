'use client'

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { StatsCards } from './StatsCards'

interface OverviewTabProps {
    totalClicks: number
    totalLinks: number
    topPlatform: string
    topCountry: string
    clicksOverTime: Array<{ date: string; count: number }>
}

export function OverviewTab({
    totalClicks,
    totalLinks,
    topPlatform,
    topCountry,
    clicksOverTime
}: OverviewTabProps) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCards
                totalClicks={totalClicks}
                totalLinks={totalLinks}
                topPlatform={topPlatform}
                topCountry={topCountry}
            />

            {/* Area Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Clicks Over Time (Last 7 Days)
                </h3>
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
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#ff6602"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorClicks)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
