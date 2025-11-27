'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

interface ChartData {
    name: string
    value: number
    color: string
    [key: string]: any
}

interface SourcesTabProps {
    sourceData: ChartData[]
}

export function SourcesTab({ sourceData }: SourcesTabProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">🚦 Traffic Sources</h3>
            <div className="h-[450px] w-full">
                {sourceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sourceData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {sourceData.map((entry, index) => (
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
    )
}
